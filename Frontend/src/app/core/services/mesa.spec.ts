import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MesaService } from './mesa';
import { Mesa } from '../models/mesa.model';

describe('MesaService', () => {
  let service: MesaService;
  let http: HttpTestingController;

  const mesas: Mesa[] = [
    { mesaId: 10, numero: 1, estado: 'Disponible' },
    { mesaId: 11, numero: 2, estado: 'Disponible' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MesaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('encuentra una mesa por su número, no por su id', () => {
    let resultado: Mesa | undefined;
    service.obtenerPorNumero(2).subscribe((mesa) => (resultado = mesa));
    http.expectOne('/api/Mesas').flush(mesas);
    expect(resultado?.mesaId).toBe(11);
  });

  it('devuelve undefined si el número de mesa no existe', () => {
    let resultado: Mesa | undefined = mesas[0];
    service.obtenerPorNumero(99).subscribe((mesa) => (resultado = mesa));
    http.expectOne('/api/Mesas').flush(mesas);
    expect(resultado).toBeUndefined();
  });
});
