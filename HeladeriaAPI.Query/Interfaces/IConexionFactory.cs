using System.Data;

namespace HeladeriaAPI.Query.Interfaces
{
    /// <summary>
    /// Fábrica de conexiones a la base de datos. Permite que las capas Query y Repository
    /// no dependan directamente de SQL Server y facilita las pruebas.
    /// </summary>
    public interface IConexionFactory
    {
        /// <summary>
        /// Crea una nueva conexión (cerrada). Quien la use debe liberarla con <c>using</c>.
        /// </summary>
        IDbConnection CrearConexion();
    }
}
