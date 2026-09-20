
using Dapper.Contrib.Extensions;

namespace HeladeriaAPI.Models
{
    /// <summary>
    /// Clasificación de productos (ej. Helados, Bebidas, Postres).
    /// </summary>
    [Table("Categorias")]
    public class Categoria
    {
        /// <summary>
        /// Identificador único de la categoría.
        /// </summary>
        [Key]
        public int CategoriaId { get; set; }

        /// <summary>
        /// Nombre de la categoría.
        /// </summary>
        public string Nombre { get; set; } = string.Empty;
    }
}
