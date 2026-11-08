import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { errorInterceptor } from '../../core/interceptors/error';

registerLocaleData(localeEsCo);

const configurar = () => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(withInterceptors([errorInterceptor])), provideHttpClientTesting(), { provide: LOCALE_ID, useValue: 'es-CO' }],
  });
  return TestBed.inject(HttpTestingController);
};

import { Productos } from './productos';

describe('Productos', () => {
  it('lista productos con categoría, precio y disponibilidad', async () => {
    const http = configurar();
    const f = TestBed.createComponent(Productos);
    http.expectOne('/api/Productos').flush([
      { productoId: 1, categoriaId: 1, nombre: 'Helado de Fresa', precio: 5000, activo: true },
      { productoId: 2, categoriaId: 9, nombre: 'Agotado', precio: 1000, activo: false },
    ]);
    http.expectOne('/api/Categorias').flush([{ categoriaId: 1, nombre: 'Helados' }]);
    await f.whenStable();
    const filas = Array.from<HTMLElement>(f.nativeElement.querySelectorAll('tbody tr')).map((r) => r.textContent!.replace(/\s+/g, ' ').trim());
    expect(filas[0]).toBe('Helado de FresaHelados$5.000Disponible');
    expect(filas[1]).toContain('Categoría 9');
    expect(filas[1]).toContain('No disponible');
  });

  it('muestra el error y permite reintentar', async () => {
    const http = configurar();
    const f = TestBed.createComponent(Productos);
    http.expectOne('/api/Productos').flush('x', { status: 500, statusText: 'Error' });
    http.match('/api/Categorias');
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role=alert]')).toBeTruthy();
    (f.nativeElement.querySelector('[role=alert] button') as HTMLButtonElement).click();
    http.expectOne('/api/Productos').flush([]);
    http.expectOne('/api/Categorias').flush([]);
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain('No hay productos registrados.');
  });
});
