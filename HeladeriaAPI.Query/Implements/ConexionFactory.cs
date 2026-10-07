using System.Data;
using HeladeriaAPI.Query.Interfaces;
using Microsoft.Data.SqlClient;

namespace HeladeriaAPI.Query.Implements
{
    /// <summary>
    /// Crea conexiones a SQL Server a partir de la cadena de conexión configurada.
    /// </summary>
    public class ConexionFactory : IConexionFactory
    {
        private readonly string _cadenaConexion;

        /// <param name="cadenaConexion">Cadena de conexión definida en appsettings.json.</param>
        public ConexionFactory(string cadenaConexion)
        {
            if (string.IsNullOrWhiteSpace(cadenaConexion))
                throw new ArgumentException("La cadena de conexión no puede estar vacía.", nameof(cadenaConexion));

            _cadenaConexion = cadenaConexion;
        }

        /// <inheritdoc />
        public IDbConnection CrearConexion() => new SqlConnection(_cadenaConexion);
    }
}
