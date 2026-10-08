# HeladeriaAPI

API REST en .NET 10 para gestionar pedidos de una heladería. Usa Dapper (Dapper.Contrib) con SQL Server y Swagger para probar los endpoints.

## Estructura

- `HeladeriaAPI`: proyecto Web API (Controllers, Swagger/XML, `Program.cs`).
- `HeladeriaAPI.Models`: clases de las tablas.
- `HeladeriaAPI.Query`: consultas de lectura (SELECT).
- `HeladeriaAPI.Repository`: operaciones de escritura (crear pedido, actualizar estado).
- `BaseDeDatos/script.sql`: script para crear la base de datos.

## Requisitos

- .NET SDK 10
- SQL Server (local, Express o en Docker)

## 1. Crear la base de datos

Ejecuta `BaseDeDatos/script.sql` en SQL Server Management Studio (o `sqlcmd`). Crea la base `HeladeriaAPI_DB`, sus tablas y datos de ejemplo (2 productos y 3 mesas). Se puede ejecutar más de una vez sin duplicar datos.

## 2. Configurar la cadena de conexión

No se sube la contraseña al repositorio. Guárdala en tu equipo con user-secrets, reemplazando `TU_USUARIO`, `TU_CLAVE` y el servidor si hace falta:

```
dotnet user-secrets init --project HeladeriaAPI\HeladeriaAPI.csproj
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=HeladeriaAPI_DB;User Id=TU_USUARIO;Password=TU_CLAVE;TrustServerCertificate=True;" --project HeladeriaAPI\HeladeriaAPI.csproj
```

El puerto `1433` es el predeterminado de SQL Server. Cámbialo si tu instancia usa otro.

## 3. Ejecutar

```
dotnet run --project HeladeriaAPI\HeladeriaAPI.csproj
```

Abre `http://localhost:5152/swagger` (el puerto exacto aparece en la consola).

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/Categorias`, `/api/Categorias/{id}` | Consulta de categorías |
| GET | `/api/Mesas`, `/api/Mesas/{id}` | Consulta de mesas |
| GET | `/api/Productos`, `/api/Productos/{id}`, `/api/Productos/categoria/{categoriaId}` | Consulta de productos |
| GET | `/api/Pedidos`, `/api/Pedidos/{id}`, `/api/Pedidos/estado/{estado}`, `/api/Pedidos/mesa/{mesaId}`, `/api/Pedidos/{id}/detalles` | Consulta de pedidos |
| POST | `/api/Pedidos` | Crea un pedido con sus detalles (el total se calcula solo) |
| PUT | `/api/Pedidos/{id}/estado` | Cambia el estado del pedido |

Estados válidos de un pedido: `Pendiente`, `En Preparacion`, `Listo`, `Entregado`.

Ejemplo de cuerpo para `POST /api/Pedidos`:

```json
{
  "mesaId": 1,
  "detalles": [
    { "productoId": 1, "cantidad": 2, "precioUnitario": 5000, "sabores": "Chocolate" }
  ]
}
```