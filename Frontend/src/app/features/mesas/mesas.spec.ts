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

import { Mesas } from './mesas';

describe('Mesas', () => {
  it('lista las mesas ordenadas por número', async () => {
    const http = configurar();
    const f = TestBed.createComponent(Mesas);
    http.expectOne('/api/Mesas').flush([
      { mesaId: 2, numero: 2, estado: 'Disponible' }, { mesaId: 1, numero: 1, estado: 'Ocupada' },
    ]);
    await f.whenStable();
    const t = Array.from<HTMLElement>(f.nativeElement.querySelectorAll('.mesa')).map((m) => m.textContent!.replace(/\s+/g, ' ').trim());
    expect(t).toEqual(['Mesa 1Ocupada', 'Mesa 2Disponible']);
  });

  it('muestra el error', async () => {
    const http = configurar();
    const f = TestBed.createComponent(Mesas);
    http.expectOne('/api/Mesas').flush('x', { status: 500, statusText: 'Error' });
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role=alert]')).toBeTruthy();
  });
});
