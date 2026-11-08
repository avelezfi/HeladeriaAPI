/**
 * Estados que acepta el backend. Ojo: "En Preparacion" se envía SIN tilde,
 * tal como lo valida la API; en pantalla se muestra "En preparación".
 */
export type EstadoPedido = 'Pendiente' | 'En Preparacion' | 'Listo' | 'Entregado';

export const ESTADOS_PEDIDO: readonly EstadoPedido[] = [
  'Pendiente',
  'En Preparacion',
  'Listo',
  'Entregado',
];

const ETIQUETAS: Record<EstadoPedido, string> = {
  Pendiente: 'Pendiente',
  'En Preparacion': 'En preparación',
  Listo: 'Listo',
  Entregado: 'Entregado',
};

/** Texto que se muestra al usuario para un estado. */
export function etiquetaEstado(estado: EstadoPedido): string {
  return ETIQUETAS[estado];
}

/**
 * Siguiente estado en el flujo de cocina, o null si el pedido ya fue entregado.
 * El backend acepta cualquier estado válido; este orden lo exige el frontend.
 */
export function siguienteEstado(estado: EstadoPedido): EstadoPedido | null {
  const posicion = ESTADOS_PEDIDO.indexOf(estado);
  return ESTADOS_PEDIDO[posicion + 1] ?? null;
}
