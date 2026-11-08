import { haceCuanto } from './tiempo';

describe('haceCuanto', () => {
  const ahora = new Date('2026-01-01T12:00:00Z').getTime();
  it.each([
    ['2026-01-01T11:59:40Z', 'hace unos segundos'],
    ['2026-01-01T11:54:00Z', 'hace 6 min'],
    ['2026-01-01T09:00:00Z', 'hace 3 h'],
    ['2025-12-30T12:00:00Z', 'hace 2 d'],
    ['no es fecha', ''],
  ])('%s -> %s', (fecha, esperado) => expect(haceCuanto(fecha, ahora)).toBe(esperado));
});
