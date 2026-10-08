using System.ComponentModel.DataAnnotations;
using HeladeriaAPI.Models;
using HeladeriaAPI.Query.Interfaces;
using HeladeriaAPI.Repository.Interfaces;
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
        private static readonly string[] EstadosValidos =
            { "Pendiente", "En Preparacion", "Listo", "Entregado" };

        private readonly IPedidoQueries _pedidoQueries;
        private readonly IMesaQueries _mesaQueries;
        private readonly IPedidoRepository _pedidoRepository;
        private readonly IDetallePedidoRepository _detallePedidoRepository;

        public PedidosController(
            IPedidoQueries pedidoQueries,
            IMesaQueries mesaQueries,
            IPedidoRepository pedidoRepository,
            IDetallePedidoRepository detallePedidoRepository)
        {
            _pedidoQueries = pedidoQueries;
            _mesaQueries = mesaQueries;
            _pedidoRepository = pedidoRepository;
            _detallePedidoRepository = detallePedidoRepository;
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
        /// <param name="estado">Estado del pedido (Pendiente, En Preparacion, Listo, Entregado).</param>
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

        /// <summary>
        /// Crea un pedido con sus detalles. Queda en estado "Pendiente" y el total se calcula solo.
        /// </summary>
        /// <param name="solicitud">Mesa y lista de ítems del pedido.</param>
        /// <response code="201">Pedido creado.</response>
        /// <response code="400">Los datos enviados no son válidos.</response>
        /// <response code="404">No existe la mesa indicada.</response>
        [HttpPost]
        [ProducesResponseType(typeof(Pedido), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Crear([FromBody] CrearPedidoRequest solicitud)
        {
            var mesa = await _mesaQueries.ObtenerPorIdAsync(solicitud.MesaId);
            if (mesa is null)
                return NotFound($"No existe la mesa {solicitud.MesaId}.");

            var pedidoId = await _pedidoRepository.CrearAsync(new Pedido { MesaId = solicitud.MesaId });

            try
            {
                foreach (var item in solicitud.Detalles)
                {
                    await _detallePedidoRepository.AgregarDetalleAsync(new DetallePedido
                    {
                        PedidoId = pedidoId,
                        ProductoId = item.ProductoId,
                        Cantidad = item.Cantidad,
                        PrecioUnitario = item.PrecioUnitario,
                        Sabores = item.Sabores,
                        Toppings = item.Toppings,
                        Observaciones = item.Observaciones
                    });
                }
            }
            catch
            {
                // Si falla un detalle, se elimina el pedido para no dejarlo incompleto.
                await _pedidoRepository.EliminarAsync(pedidoId);
                throw;
            }

            var creado = await _pedidoQueries.ObtenerPorIdAsync(pedidoId);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = pedidoId }, creado);
        }

        /// <summary>
        /// Cambia el estado de un pedido.
        /// </summary>
        /// <param name="id">Identificador del pedido.</param>
        /// <param name="solicitud">Nuevo estado: Pendiente, En Preparacion, Listo o Entregado.</param>
        /// <response code="204">Estado actualizado.</response>
        /// <response code="400">El estado no es válido.</response>
        /// <response code="404">No existe un pedido con ese id.</response>
        [HttpPut("{id:int}/estado")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ActualizarEstado(int id, [FromBody] ActualizarEstadoRequest solicitud)
        {
            var estado = EstadosValidos.FirstOrDefault(e =>
                string.Equals(e, solicitud.Estado, StringComparison.OrdinalIgnoreCase));

            if (estado is null)
                return BadRequest($"Estado no válido. Valores permitidos: {string.Join(", ", EstadosValidos)}.");

            var actualizado = await _pedidoRepository.ActualizarEstadoAsync(id, estado);
            if (!actualizado) return NotFound();

            return NoContent();
        }
    }

    /// <summary>
    /// Datos para crear un pedido.
    /// </summary>
    public class CrearPedidoRequest
    {
        /// <summary>Mesa donde se genera el pedido.</summary>
        [Range(1, int.MaxValue)]
        public int MesaId { get; set; }

        /// <summary>Ítems del pedido (mínimo uno).</summary>
        [Required, MinLength(1)]
        public List<DetalleSolicitud> Detalles { get; set; } = new();
    }

    /// <summary>
    /// Ítem de un pedido.
    /// </summary>
    public class DetalleSolicitud
    {
        /// <summary>Producto base o tamaño seleccionado.</summary>
        [Range(1, int.MaxValue)]
        public int ProductoId { get; set; }

        /// <summary>Cantidad solicitada.</summary>
        [Range(1, 1000)]
        public int Cantidad { get; set; }

        /// <summary>Precio por unidad de este ítem.</summary>
        [Range(0.01, 1000000)]
        public decimal PrecioUnitario { get; set; }

        /// <summary>Sabores elegidos (ej. "Vainilla, Chocolate").</summary>
        public string? Sabores { get; set; }

        /// <summary>Toppings o adicionales (ej. "Chispas, Maní").</summary>
        public string? Toppings { get; set; }

        /// <summary>Observaciones del cliente (ej. "Sin crema").</summary>
        public string? Observaciones { get; set; }
    }

    /// <summary>
    /// Datos para cambiar el estado de un pedido.
    /// </summary>
    public class ActualizarEstadoRequest
    {
        /// <summary>Nuevo estado del pedido.</summary>
        [Required]
        public string Estado { get; set; } = string.Empty;
    }
}