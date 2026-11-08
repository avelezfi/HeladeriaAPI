import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { Inicio } from './inicio';
import { MesaSesionService } from '../../core/services/mesa-sesion';

describe('Inicio', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
  });

  async function crear() {
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    return fixture;
  }

  function enviar(fixture: Awaited<ReturnType<typeof crear>>, texto: string) {
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = texto;
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
  }

  it('pide un número válido', async () => {
    const f = await crear();
    enviar(f, 'abc');
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role=alert]').textContent).toContain('Escribe el número de tu mesa');
    http.expectNone('/api/Mesas');
  });

  it('avisa si la mesa no existe', async () => {
    const f = await crear();
    enviar(f, '9');
    http.expectOne('/api/Mesas').flush([{ mesaId: 1, numero: 1, estado: 'Disponible' }]);
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role=alert]').textContent).toContain('No encontramos la mesa 9');
  });

  it('guarda la mesa y entra al menú', async () => {
    const f = await crear();
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    enviar(f, '2');
    http.expectOne('/api/Mesas').flush([{ mesaId: 2, numero: 2, estado: 'Disponible' }]);
    await f.whenStable();
    expect(TestBed.inject(MesaSesionService).mesa()?.numero).toBe(2);
    expect(navegar).toHaveBeenCalledWith('/menu');
  });

  it('muestra el error del servidor', async () => {
    const f = await crear();
    enviar(f, '1');
    http.expectOne('/api/Mesas').flush('x', { status: 500, statusText: 'Server Error' });
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role=alert]').textContent.length).toBeGreaterThan(5);
  });
});
