import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../core/models/categoria.model';
import { Producto } from '../../core/models/producto.model';
import { CategoriaService } from '../../core/services/categoria';
import { ProductoService } from '../../core/services/producto';
import { mensajeError } from '../../core/utils/errores';
import { Pesos } from '../../shared/pipes/pesos';

/** Catálogo de productos (solo lectura): el backend no ofrece crear ni editar productos desde aquí. */
@Component({
  selector: 'app-productos',
  imports: [Pesos],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Productos {
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);

  protected readonly productos = signal<Producto[]>([]);
  private readonly categorias = signal<Categoria[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filas = computed(() =>
    this.productos().map((p) => ({
      ...p,
      categoria: this.categorias().find((c) => c.categoriaId === p.categoriaId)?.nombre ?? `Categoría ${p.categoriaId}`,
    })));

  constructor() {
    this.cargar();
  }

  protected cargar() {
    this.cargando.set(true);
    this.error.set(null);
    forkJoin({ productos: this.productoService.obtenerTodos(), categorias: this.categoriaService.obtenerTodos() }).subscribe({
      next: ({ productos, categorias }) => {
        this.productos.set(productos);
        this.categorias.set(categorias);
        this.cargando.set(false);
      },
      error: (e: unknown) => {
        this.error.set(mensajeError(e, 'No se pudieron cargar los productos.'));
        this.cargando.set(false);
      },
    });
  }
}
