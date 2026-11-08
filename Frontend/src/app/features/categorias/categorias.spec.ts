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

import { Categorias } from './categorias';

describe('Categorias', () => {
  it('cuenta los productos de cada categoría', async () => {
    const http = configurar();
    const f = TestBed.createComponent(Categorias);
    http.expectOne('/api/Categorias').flush([{ categoriaId: 1, nombre: 'Helados' }, { categoriaId: 2, nombre: 'Postres' }]);
    http.expectOne('/api/Productos').flush([
      { productoId: 1, categoriaId: 1, nombre: 'a', precio: 1, activo: true },
      { productoId: 2, categoriaId: 1, nombre: 'b', precio: 1, activo: true },
    ]);
    await f.whenStable();
    const filas = Array.from<HTMLElement>(f.nativeElement.querySelectorAll('tbody tr')).map((r) => r.textContent!.replace(/\s+/g, ' ').trim());
    expect(filas).toEqual(['Helados2', 'Postres0']);
  });

  it('muestra el error', async () => {
    const http = configurar();
    const f = TestBed.createComponent(Categorias);
    http.expectOne('/api/Categorias').flush('x', { status: 500, statusText: 'Error' });
    http.match('/api/Productos');
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role=alert]')).toBeTruthy();
  });
});
