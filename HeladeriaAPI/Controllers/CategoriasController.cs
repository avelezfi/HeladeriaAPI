using HeladeriaAPI.Models;
using HeladeriaAPI.Query.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HeladeriaAPI.Controllers
{
    /// <summary>
    /// Consulta de las categorías de productos de la heladería.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaQueries _categoriaQueries;

        public CategoriasController(ICategoriaQueries categoriaQueries)
        {
            _categoriaQueries = categoriaQueries;
        }

        /// <summary>
        /// Obtiene la lista de todas las categorías.
        /// </summary>
        /// <response code="200">Devuelve la lista de categorías.</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Categoria>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ObtenerTodas()
        {
            return Ok(await _categoriaQueries.ObtenerTodasAsync());
        }

        /// <summary>
        /// Obtiene una categoría por su identificador.
        /// </summary>
        /// <param name="id">Identificador de la categoría.</param>
        /// <response code="200">Devuelve la categoría.</response>
        /// <response code="404">No existe una categoría con ese id.</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(Categoria), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var categoria = await _categoriaQueries.ObtenerPorIdAsync(id);
            if (categoria is null) return NotFound();
            return Ok(categoria);
        }
    }
}