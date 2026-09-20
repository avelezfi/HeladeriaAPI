
using Dapper.Contrib.Extensions;

namespace HeladeriaAPI.Models
{
    /// <summary>
    /// Representa un producto base, tamaño o topping disponible en el catálogo.
    /// </summary>
    [Table("Productos")]
    public class Producto
    {
        /// <summary>
        /// Identificador único del producto.
        /// </summary>
        [Key]
        public int ProductoId { get; set; }

        /// <summary>
        /// Identificador de la categoría asociada.
        /// </summary>
        public int CategoriaId { get; set; }

        /// <summary>
        /// Nombre del producto o ingrediente.
        /// </summary>
        public string Nombre { get; set; } = string.Empty;

        /// <summary>
        /// Precio base o adicional.
        /// </summary>
        public decimal Precio { get; set; }

        /// <summary>
        /// Indica si está disponible actualmente.
        /// </summary>
        public bool Activo { get; set; }
    }
}
