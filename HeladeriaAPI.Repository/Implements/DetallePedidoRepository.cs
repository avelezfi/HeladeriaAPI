using System.Data;
using System.Threading.Tasks;
using Dapper;
using Dapper.Contrib.Extensions;
using HeladeriaAPI.Models;
using HeladeriaAPI.Repository.Interfaces;

namespace HeladeriaAPI.Repository.Implements
{
    /// <summary>
    /// Operaciones de escritura sobre los detalles (ítems) de un pedido.
    /// Cada cambio recalcula el Total del pedido dentro de la misma transacción.
    /// </summary>
    public class DetallePedidoRepository : IDetallePedidoRepository
    {
        private readonly IDbConnection _conexion;

        public DetallePedidoRepository(IDbConnection conexion)
        {
            _conexion = conexion;
        }

        /// <summary>
        /// Agrega un ítem a un pedido, devuelve su identificador y actualiza el Total del pedido.
        /// </summary>
        public async Task<int> AgregarDetalleAsync(DetallePedido detalle)
        {
            if (_conexion.State != ConnectionState.Open)
                _conexion.Open();

            using var transaccion = _conexion.BeginTransaction();
            try
            {
                var id = await _conexion.InsertAsync(detalle, transaccion);
                await RecalcularTotalAsync(detalle.PedidoId, transaccion);

                transaccion.Commit();
                return (int)id;
            }
            catch
            {
                transaccion.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Elimina un ítem y actualiza el Total de su pedido. Devuelve false si el detalle no existe.
        /// </summary>
        public async Task<bool> EliminarDetalleAsync(int detallePedidoId)
        {
            if (_conexion.State != ConnectionState.Open)
                _conexion.Open();

            using var transaccion = _conexion.BeginTransaction();
            try
            {
                var pedidoId = await _conexion.QueryFirstOrDefaultAsync<int?>(
                    "SELECT PedidoId FROM DetallesPedido WHERE DetallePedidoId = @Id;",
                    new { Id = detallePedidoId }, transaccion);

                if (pedidoId is null)
                {
                    transaccion.Rollback();
                    return false;
                }

                await _conexion.ExecuteAsync(
                    "DELETE FROM DetallesPedido WHERE DetallePedidoId = @Id;",
                    new { Id = detallePedidoId }, transaccion);

                await RecalcularTotalAsync(pedidoId.Value, transaccion);

                transaccion.Commit();
                return true;
            }
            catch
            {
                transaccion.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Total del pedido = suma de Cantidad x PrecioUnitario de todos sus detalles.
        /// </summary>
        private Task<int> RecalcularTotalAsync(int pedidoId, IDbTransaction transaccion)
        {
            const string sql = @"
                UPDATE Pedidos
                SET Total = ISNULL((SELECT SUM(Cantidad * PrecioUnitario)
                                    FROM DetallesPedido
                                    WHERE PedidoId = @PedidoId), 0)
                WHERE PedidoId = @PedidoId;";

            return _conexion.ExecuteAsync(sql, new { PedidoId = pedidoId }, transaccion);
        }
    }
}
