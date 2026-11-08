import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Preparacion } from './preparacion';
import { errorInterceptor } from '../../core/interceptors/error';

const hace = (min: number) => new Date(Date.now() - min * 60000).toISOString();
const pedidos = [
  { pedidoId: 12, mesaId: 3, fecha: hace(6), estado: 'Pendiente', total: 5000 },
  { pedidoId: 13, mesaId: 1, fecha: hace(2), estado: 'Pendiente', total: 11000 },
  { pedidoId: 11, mesaId: 5, fecha: hace(9), estado: 'En Preparacion', total: 12000 },
  { pedidoId: 9, mesaId: 2, fecha: hace(50), estado: 'Entregado', total: 9000 },
];

describe('Preparacion', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([errorInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => vi.useRealTimers());

  const asentar = async () => { await vi.advanceTimersByTimeAsync(0); TestBed.tick(); };

  async function crear() {
    const f = TestBed.createComponent(Preparacion);
    await vi.advanceTimersByTimeAsync(0);
    http.expectOne('/api/Productos').flush([{ productoId: 1, categoriaId: 1, nombre: 'Helado de Vainilla', precio: 5000, activo: true }]);
    http.expectOne('/api/Mesas').flush([
      { mesaId: 1, numero: 1, estado: 'x' }, { mesaId: 3, numero: 3, estado: 'x' }, { mesaId: 5, numero: 5, estado: 'x' },
    ]);
    http.expectOne('/api/Pedidos').flush(pedidos);
    await vi.advanceTimersByTimeAsync(0);
    for (const id of [12, 13, 11]) {
      http.expectOne(`/api/Pedidos/${id}/detalles`).flush([
        { detallePedidoId: id, pedidoId: id, productoId: 1, cantidad: 2, sabores: 'Fresa', observaciones: 'Sin crema', precioUnitario: 5000 },
      ]);
    }
    await asentar();
    return f;
  }

  it('agrupa por estado, oculta entregados y ordena por antigüedad', async () => {
    const f = await crear();
    const cols = Array.from<HTMLElement>(f.nativeElement.querySelectorAll('.columna'));
    expect(cols.length).toBe(3);
    expect(cols[0].querySelector('.contador')!.textContent).toBe('2');
    const mesas = Array.from(cols[0].querySelectorAll('.pedido__mesa')).map((e) => e.textContent);
    expect(mesas).toEqual(['Mesa 3', 'Mesa 1']); // el pedido de hace 6 min va primero
    expect(cols[2].textContent).toContain('Sin pedidos');
    expect(f.nativeElement.textContent).not.toContain('Pedido 9');
  });

  it('muestra los ítems con nombre, sabores y notas', async () => {
    const f = await crear();
    const t: string = f.nativeElement.textContent;
    expect(t).toContain('2 × Helado de Vainilla');
    expect(t).toContain('Sabores: Fresa');
    expect(t).toContain('Sin crema');
  });

  it('avanza el estado con el nombre exacto que acepta la API', async () => {
    const f = await crear();
    const boton = f.nativeElement.querySelector('.Pendiente .pedido .boton') as HTMLButtonElement;
    expect(boton.textContent).toContain('Empezar a preparar');
    boton.click();
    const req = http.expectOne('/api/Pedidos/12/estado');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ estado: 'En Preparacion' });
    req.flush(null, { status: 204, statusText: 'No Content' });
    await asentar();
    // se vuelve a consultar de inmediato, sin esperar 5 s
    http.expectOne('/api/Pedidos').flush(pedidos.map((p) => (p.pedidoId === 12 ? { ...p, estado: 'En Preparacion' } : p)));
    await asentar();
    expect(f.nativeElement.querySelectorAll('.EnPreparacion .pedido').length).toBe(2);
    http.expectNone((r) => r.url.includes('detalles')); // los ítems ya conocidos no se piden otra vez
  });

  it('muestra el error si el cambio falla y no mueve el pedido', async () => {
    const f = await crear();
    (f.nativeElement.querySelector('.Pendiente .pedido .boton') as HTMLButtonElement).click();
    http.expectOne('/api/Pedidos/12/estado').flush('Estado no válido. Valores permitidos: x.', { status: 400, statusText: 'Bad Request' });
    await asentar();
    expect(f.nativeElement.querySelector('[role=alert]')).toBeTruthy();
    expect(f.nativeElement.querySelectorAll('.Pendiente .pedido').length).toBe(2);
  });

  it('vuelve a consultar cada 5 segundos y tolera un fallo', async () => {
    const f = await crear();
    await vi.advanceTimersByTimeAsync(5000);
    http.expectOne('/api/Pedidos').flush('x', { status: 500, statusText: 'Error' });
    await asentar();
    expect(f.nativeElement.querySelector('[role=alert]')).toBeTruthy();
    expect(f.nativeElement.querySelectorAll('.pedido').length).toBe(3); // conserva lo último
    await vi.advanceTimersByTimeAsync(5000);
    http.expectOne('/api/Pedidos').flush(pedidos);
    await asentar();
    expect(f.nativeElement.querySelector('[role=alert]')).toBeNull();
  });
});
