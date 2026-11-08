import { EstadoPedido } from './estado-pedido.model';

export interface Pedido {
  pedidoId: number;
  mesaId: number;
  fecha: string;
  estado: EstadoPedido;
  total: number;
}
