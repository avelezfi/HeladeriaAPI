using HeladeriaAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HeladeriaAPI.Query.Interfaces
{
    public interface IPedidoQueries
    {
        Task<IEnumerable<Pedido>> ObtenerTodosAsync();
        Task<Pedido?> ObtenerPorIdAsync(int id);
        Task<IEnumerable<Pedido>> ObtenerPorEstadoAsync(string estado);
        Task<IEnumerable<Pedido>> ObtenerPorMesaAsync(int mesaId);
        Task<IEnumerable<DetallePedido>> ObtenerDetallesPorPedidoAsync(int pedidoId);
    }
}
