import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductoService } from './producto';

describe('ProductoService', () => {
  let service: ProductoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta todos los productos', () => {
    service.obtenerTodos().subscribe();
    http.expectOne('/api/Productos').flush([]);
  });

  it('consulta los productos de una categoría', () => {
    service.obtenerPorCategoria(1).subscribe();
    http.expectOne('/api/Productos/categoria/1').flush([]);
  });
});
