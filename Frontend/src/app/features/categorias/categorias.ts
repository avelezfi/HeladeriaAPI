import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../core/models/categoria.model';
import { Producto } from '../../core/models/producto.model';
import { CategoriaService } from '../../core/services/categoria';
import { ProductoService } from '../../core/services/producto';
import { mensajeError } from '../../core/utils/errores';

/** Categorías con la cantidad de productos de cada una (solo lectura). */
@Component({
  selector: 'app-categorias',
  imports: [],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categorias {
  private readonly categoriaService = inject(CategoriaService);
  private readonly productoService = inject(ProductoService);

  private readonly categorias = signal<Categoria[]>([]);
  private readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filas = computed(() =>
    this.categorias().map((c) => ({
      ...c,
      cantidad: this.productos().filter((p) => p.categoriaId === c.categoriaId).length,
    })));

  constructor() {
    this.cargar();
  }

  protected cargar() {
    this.cargando.set(true);
    this.error.set(null);
    forkJoin({ categorias: this.categoriaService.obtenerTodos(), productos: this.productoService.obtenerTodos() }).subscribe({
      next: ({ categorias, productos }) => {
        this.categorias.set(categorias);
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: (e: unknown) => {
        this.error.set(mensajeError(e, 'No se pudieron cargar las categorías.'));
        this.cargando.set(false);
      },
    });
  }
}
