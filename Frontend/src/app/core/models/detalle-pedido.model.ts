export interface DetallePedido {
  detallePedidoId: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  sabores?: string;
  toppings?: string;
  observaciones?: string;
  precioUnitario: number;
}
