import { Subject, of, throwError } from 'rxjs';
import { sondeo } from './sondeo';

describe('sondeo', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('consulta de inmediato y luego cada 5 segundos', async () => {
    let n = 0;
    const valores: number[] = [];
    const s = sondeo(() => of(++n)).subscribe((r) => r.ok && valores.push(r.valor));
    await vi.advanceTimersByTimeAsync(0);
    expect(valores).toEqual([1]);
    await vi.advanceTimersByTimeAsync(5000);
    expect(valores).toEqual([1, 2]);
    s.unsubscribe();
    await vi.advanceTimersByTimeAsync(10000);
    expect(valores).toEqual([1, 2]);
  });

  it('un error no corta el sondeo', async () => {
    let n = 0;
    const r: boolean[] = [];
    const s = sondeo(() => (++n === 1 ? throwError(() => new Error('x')) : of(n))).subscribe((x) => r.push(x.ok));
    await vi.advanceTimersByTimeAsync(5000);
    expect(r).toEqual([false, true]);
    s.unsubscribe();
  });

  it('permite refrescar a demanda', async () => {
    const ref = new Subject<void>();
    let n = 0;
    const s = sondeo(() => of(++n), ref).subscribe();
    await vi.advanceTimersByTimeAsync(0);
    ref.next();
    expect(n).toBe(2);
    s.unsubscribe();
  });
});
