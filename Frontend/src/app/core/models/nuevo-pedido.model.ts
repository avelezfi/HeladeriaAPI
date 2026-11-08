/** Ítem que se envía al crear un pedido (POST /api/Pedidos). */
export interface NuevoDetalle {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  sabores?: string;
  toppings?: string;
  observaciones?: string;
}

/** Cuerpo de POST /api/Pedidos. El total lo calcula el backend. */
export interface NuevoPedido {
  mesaId: number;
  detalles: NuevoDetalle[];
}
