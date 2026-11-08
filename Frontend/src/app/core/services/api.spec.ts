import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Api } from './api';

describe('Api', () => {
  let service: Api;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Api);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('usa la URL base del entorno en las peticiones GET', () => {
    service.get('Categorias').subscribe();
    const req = http.expectOne('/api/Categorias');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('envía el cuerpo en las peticiones POST', () => {
    service.post('Pedidos', { mesaId: 1 }).subscribe();
    const req = http.expectOne('/api/Pedidos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ mesaId: 1 });
    req.flush({});
  });
});
