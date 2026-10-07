using Dapper;
using HeladeriaAPI.Models;
using HeladeriaAPI.Query.Interfaces;

namespace HeladeriaAPI.Query.Implements
{
    /// <summary>
    /// Consultas (solo lectura) sobre pedidos y sus detalles, usando Dapper.
    /// </summary>
    public class PedidoQueries : IPedidoQueries
    {
        private readonly IConexionFactory _conexionFactory;

        public PedidoQueries(IConexionFactory conexionFactory)
        {
            _conexionFactory = conexionFactory;
        }

        /// <summary>
        /// Lista todos los pedidos, del más reciente al más antiguo.
        /// </summary>
        public async Task<IEnumerable<Pedido>> ObtenerTodosAsync()
        {
            const string sql = @"
                SELECT PedidoId, MesaId, Fecha, Estado, Total
                FROM Pedidos
                ORDER BY Fecha DESC;";

            using var conexion = _conexionFactory.CrearConexion();
            return await conexion.QueryAsync<Pedido>(sql);
        }

        /// <summary>
        /// Consulta un pedido por su identificador. Devuelve null si no existe.
        /// </summary>
        public async Task<Pedido?> ObtenerPorIdAsync(int id)
        {
            const string sql = @"
                SELECT PedidoId, MesaId, Fecha, Estado, Total
                FROM Pedidos
                WHERE PedidoId = @Id;";

            using var conexion = _conexionFactory.CrearConexion();
            return await conexion.QuerySingleOrDefaultAsync<Pedido>(sql, new { Id = id });
        }

        /// <summary>
        /// Filtra los pedidos por estado (ej. Pendiente, En Preparacion, Listo, Entregado).
        /// Se ordena del más antiguo al más reciente, que es el orden de atención en cocina.
        /// </summary>
        public async Task<IEnumerable<Pedido>> ObtenerPorEstadoAsync(string estado)
        {
            const string sql = @"
                SELECT PedidoId, MesaId, Fecha, Estado, Total
                FROM Pedidos
                WHERE Estado = @Estado
                ORDER BY Fecha ASC;";

            using var conexion = _conexionFactory.CrearConexion();
            return await conexion.QueryAsync<Pedido>(sql, new { Estado = estado });
        }

        /// <summary>
        /// Lista los pedidos de una mesa, del más reciente al más antiguo.
        /// </summary>
        public async Task<IEnumerable<Pedido>> ObtenerPorMesaAsync(int mesaId)
        {
            const string sql = @"
                SELECT PedidoId, MesaId, Fecha, Estado, Total
                FROM Pedidos
                WHERE MesaId = @MesaId
                ORDER BY Fecha DESC;";

            using var conexion = _conexionFactory.CrearConexion();
            return await conexion.QueryAsync<Pedido>(sql, new { MesaId = mesaId });
        }

        /// <summary>
        /// Lista los ítems (detalles) que componen un pedido.
        /// </summary>
        public async Task<IEnumerable<DetallePedido>> ObtenerDetallesPorPedidoAsync(int pedidoId)
        {
            const string sql = @"
                SELECT DetallePedidoId, PedidoId, ProductoId, Cantidad,
                       Sabores, Toppings, Observaciones, PrecioUnitario
                FROM DetallesPedido
                WHERE PedidoId = @PedidoId
                ORDER BY DetallePedidoId;";

            using var conexion = _conexionFactory.CrearConexion();
            return await conexion.QueryAsync<DetallePedido>(sql, new { PedidoId = pedidoId });
        }
    }
}
