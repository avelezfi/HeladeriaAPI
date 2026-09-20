
using HeladeriaAPI.Models;
using System.Threading.Tasks;

namespace HeladeriaAPI.Repository.Interfaces
{
    public interface IPedidoRepository
    {
        Task<int> CrearAsync(Pedido pedido);
        Task<bool> ActualizarEstadoAsync(int pedidoId, string nuevoEstado);
        Task<bool> EliminarAsync(int pedidoId);
    }
}
