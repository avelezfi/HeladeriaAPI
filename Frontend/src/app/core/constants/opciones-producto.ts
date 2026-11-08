/**
 * Opciones de personalización. El backend no tiene tablas para ellas
 * (Sabores y Toppings se guardan como texto en el detalle del pedido),
 * por eso son listas fijas definitivas acordadas con el equipo.
 * Los extras no modifican el precio.
 */
export const SABORES = ['Vainilla', 'Chocolate', 'Fresa'] as const;

export const TOPPINGS = ['Chispas de chocolate', 'Maní'] as const;

/** Solo los productos de esta categoría ofrecen sabores y toppings. */
export const CATEGORIA_PERSONALIZABLE = 'Helados';

/**
 * La base de datos incluye una categoría "Toppings" con productos con precio.
 * Como los toppings son una lista fija y sin costo dentro de la personalización,
 * esa categoría no se muestra en el menú del cliente.
 */
export const CATEGORIA_EXTRAS = 'Toppings';
