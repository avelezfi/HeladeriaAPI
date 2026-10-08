
-- Base de datos de HeladeriaAPI (SQL Server)
-- Se puede ejecutar varias veces sin duplicar datos.


IF DB_ID('HeladeriaAPI_DB') IS NULL
    CREATE DATABASE HeladeriaAPI_DB;
GO

USE HeladeriaAPI_DB;
GO

IF OBJECT_ID('dbo.Categorias') IS NULL
CREATE TABLE dbo.Categorias (
    CategoriaId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL
);

IF OBJECT_ID('dbo.Productos') IS NULL
CREATE TABLE dbo.Productos (
    ProductoId INT IDENTITY(1,1) PRIMARY KEY,
    CategoriaId INT NOT NULL REFERENCES dbo.Categorias(CategoriaId),
    Nombre NVARCHAR(100) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1
);

IF OBJECT_ID('dbo.Mesas') IS NULL
CREATE TABLE dbo.Mesas (
    MesaId INT IDENTITY(1,1) PRIMARY KEY,
    Numero INT NOT NULL,
    Estado NVARCHAR(30) NOT NULL DEFAULT 'Disponible'
);

IF OBJECT_ID('dbo.Pedidos') IS NULL
CREATE TABLE dbo.Pedidos (
    PedidoId INT IDENTITY(1,1) PRIMARY KEY,
    MesaId INT NOT NULL REFERENCES dbo.Mesas(MesaId),
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Estado NVARCHAR(30) NOT NULL DEFAULT 'Pendiente',
    Total DECIMAL(10,2) NOT NULL DEFAULT 0
);

IF OBJECT_ID('dbo.DetallesPedido') IS NULL
CREATE TABLE dbo.DetallesPedido (
    DetallePedidoId INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL REFERENCES dbo.Pedidos(PedidoId),
    ProductoId INT NOT NULL REFERENCES dbo.Productos(ProductoId),
    Cantidad INT NOT NULL,
    Sabores NVARCHAR(200) NULL,
    Toppings NVARCHAR(200) NULL,
    Observaciones NVARCHAR(300) NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL
);
GO

-- Datos de ejemplo (solo si las tablas estan vacias)
IF NOT EXISTS (SELECT 1 FROM dbo.Categorias)
    INSERT INTO dbo.Categorias (Nombre) VALUES (N'Helados'), (N'Bebidas');

IF NOT EXISTS (SELECT 1 FROM dbo.Productos)
    INSERT INTO dbo.Productos (CategoriaId, Nombre, Precio, Activo)
    SELECT CategoriaId, N'Helado Chocolate', 5000, 1 FROM dbo.Categorias WHERE Nombre = N'Helados'
    UNION ALL
    SELECT CategoriaId, N'Malteada Fresa', 8000, 1 FROM dbo.Categorias WHERE Nombre = N'Bebidas';

IF NOT EXISTS (SELECT 1 FROM dbo.Mesas)
    INSERT INTO dbo.Mesas (Numero, Estado)
    VALUES (1, N'Disponible'), (2, N'Disponible'), (3, N'Disponible');
GO