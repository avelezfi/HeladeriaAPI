using HeladeriaAPI.Models;
using HeladeriaAPI.Query.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaAPI.Controllers
{
    /// <summary>
    /// Gestión de los pedidos de la heladería.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class PedidosController : ControllerBase
    {
        private readonly IPedidoQueries _pedidoQueries;

        // TODO: inyectar IPedidoRepository y IDetallePedidoRepository cuando se suba la rama de Juan Silva.
        public PedidosController(IPedidoQueries pedidoQueries)
        {
            _pedidoQueries = pedidoQueries;
        }

        /// <summary>
        /// Obtiene la lista de todos los pedidos.
        /// </summary>
        /// <response code="200">Devuelve la lista de pedidos.</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Pedido>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ObtenerTodos()
        {
            return Ok(await _pedidoQueries.ObtenerTodosAsync());
        }

        /// <summary>
        /// Obtiene un pedido por su identificador.
        /// </summary>
        /// <param name="id">Identificador del pedido.</param>
        /// <response code="200">Devuelve el pedido.</response>
        /// <response code="404">No existe un pedido con ese id.</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(Pedido), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var pedido = await _pedidoQueries.ObtenerPorIdAsync(id);
            if (pedido is null) return NotFound();
            return Ok(pedido);
        }

        /// <summary>
        /// Filtra los pedidos por estado.
        /// </summary>
        /// <param name="estado">Estado del pedido (por ejemplo: Pendiente, Entregado).</param>
        /// <response code="200">Devuelve los pedidos con ese estado.</response>
        [HttpGet("estado/{estado}")]
        [ProducesResponseType(typeof(IEnumerable<Pedido>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ObtenerPorEstado(string estado)
        {
            return Ok(await _pedidoQueries.ObtenerPorEstadoAsync(estado));
        }

        /// <summary>
        /// Obtiene los pedidos de una mesa.
        /// </summary>
        /// <param name="mesaId">Identificador de la mesa.</param>
        /// <response code="200">Devuelve los pedidos de la mesa.</response>
        [HttpGet("mesa/{mesaId:int}")]
        [ProducesResponseType(typeof(IEnumerable<Pedido>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ObtenerPorMesa(int mesaId)
        {
            return Ok(await _pedidoQueries.ObtenerPorMesaAsync(mesaId));
        }

        /// <summary>
        /// Obtiene los detalles (líneas) de un pedido.
        /// </summary>
        /// <param name="id">Identificador del pedido.</param>
        /// <response code="200">Devuelve los detalles del pedido.</response>
        [HttpGet("{id:int}/detalles")]
        [ProducesResponseType(typeof(IEnumerable<DetallePedido>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ObtenerDetalles(int id)
        {
            return Ok(await _pedidoQueries.ObtenerDetallesPorPedidoAsync(id));
        }
    }
}