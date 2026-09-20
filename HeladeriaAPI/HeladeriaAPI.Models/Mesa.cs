
using Dapper.Contrib.Extensions;

namespace HeladeriaAPI.Models
{
    /// <summary>
    /// Punto de atención o mesa para la toma de pedidos.
    /// </summary>
    [Table("Mesas")]
    public class Mesa
    {
        /// <summary>
        /// Identificador único de la mesa.
        /// </summary>
        [Key]
        public int MesaId { get; set; }

        /// <summary>
        /// Número o identificador visible de la mesa.
        /// </summary>
        public int Numero { get; set; }

        /// <summary>
        /// Estado actual de la mesa (ej. Disponible, Ocupada).
        /// </summary>
        public string Estado { get; set; } = string.Empty;
    }
}