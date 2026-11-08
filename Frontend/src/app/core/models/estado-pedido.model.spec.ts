import { etiquetaEstado, siguienteEstado } from './estado-pedido.model';

describe('estado-pedido', () => {
  it('muestra "En preparación" con tilde aunque el valor del backend no la lleve', () => {
    expect(etiquetaEstado('En Preparacion')).toBe('En preparación');
  });

  it('sigue el flujo Pendiente → En Preparacion → Listo → Entregado', () => {
    expect(siguienteEstado('Pendiente')).toBe('En Preparacion');
    expect(siguienteEstado('En Preparacion')).toBe('Listo');
    expect(siguienteEstado('Listo')).toBe('Entregado');
  });

  it('no hay siguiente estado después de Entregado', () => {
    expect(siguienteEstado('Entregado')).toBeNull();
  });
});
