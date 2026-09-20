
using HeladeriaAPI.Models;
using System.Threading.Tasks;

namespace HeladeriaAPI.Repository.Interfaces
{
    public interface IDetallePedidoRepository
    {
        Task<int> AgregarDetalleAsync(DetallePedido detalle);
        Task<bool> EliminarDetalleAsync(int detallePedidoId);
    }
}
