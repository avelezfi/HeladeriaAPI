using HeladeriaAPI.Models;
using HeladeriaAPI.Query.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaAPI.Controllers
{
    /// <summary>
    /// Consulta de los productos (helados y complementos) de la heladería.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoQueries _productoQueries;

        public ProductosController(IProductoQueries productoQueries)
        {
            _productoQueries = productoQueries;
        }

        /// <summary>
        /// Obtiene la lista de todos los productos.
        /// </summary>
        /// <response code="200">Devuelve la lista de productos.</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Producto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ObtenerTodos()
        {
            return Ok(await _productoQueries.ObtenerTodosAsync());
        }

        /// <summary>
        /// Obtiene un producto por su identificador.
        /// </summary>
        /// <param name="id">Identificador del producto.</param>
        /// <response code="200">Devuelve el producto.</response>
        /// <response code="404">No existe un producto con ese id.</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(Producto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var producto = await _productoQueries.ObtenerPorIdAsync(id);
            if (producto is null) return NotFound();
            return Ok(producto);
        }

        /// <summary>
        /// Obtiene los productos de una categoría.
        /// </summary>
        /// <param name="categoriaId">Identificador de la categoría.</param>
        /// <response code="200">Devuelve los productos de la categoría.</response>
        [HttpGet("categoria/{categoriaId:int}")]
        [ProducesResponseType(typeof(IEnumerable<Producto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ObtenerPorCategoria(int categoriaId)
        {
            return Ok(await _productoQueries.ObtenerPorCategoriaAsync(categoriaId));
        }
    }
}