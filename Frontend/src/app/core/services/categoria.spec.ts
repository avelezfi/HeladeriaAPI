import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriaService } from './categoria';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoriaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta todas las categorías', () => {
    service.obtenerTodos().subscribe();
    http.expectOne('/api/Categorias').flush([]);
  });

  it('consulta una categoría por id', () => {
    service.obtenerPorId(2).subscribe();
    http.expectOne('/api/Categorias/2').flush({});
  });
});
