using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using HeladeriaAPI.Models;
using HeladeriaAPI.Query.Interfaces;

namespace HeladeriaAPI.Query.Implements
{
    public class MesaQueries : IMesaQueries
    {
        private readonly IDbConnection _conexion;

        public MesaQueries(IDbConnection conexion)
        {
            _conexion = conexion;
        }

        public async Task<IEnumerable<Mesa>> ObtenerTodasAsync()
        {
            const string sql = "SELECT MesaId, Numero, Estado FROM Mesas";
            return await _conexion.QueryAsync<Mesa>(sql);
        }

        public async Task<Mesa?> ObtenerPorIdAsync(int id)
        {
            const string sql = "SELECT MesaId, Numero, Estado FROM Mesas WHERE MesaId = @Id";
            return await _conexion.QueryFirstOrDefaultAsync<Mesa>(sql, new { Id = id });
        }
    }
}