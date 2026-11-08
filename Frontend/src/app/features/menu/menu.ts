import { ChangeDetectionStrategy, Component, WritableSignal, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  CATEGORIA_EXTRAS,
  CATEGORIA_PERSONALIZABLE,
  SABORES,
  TOPPINGS,
} from '../../core/constants/opciones-producto';
import { ApiError } from '../../core/models/api-error.model';
import { Categoria } from '../../core/models/categoria.model';
import { Producto } from '../../core/models/producto.model';
import { CarritoService } from '../../core/services/carrito';
import { CategoriaService } from '../../core/services/categoria';
import { ProductoService } from '../../core/services/producto';
import { Pesos } from '../../shared/pipes/pesos';

const mismoNombre = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Menú por categorías. Los helados se pueden personalizar con sabores, toppings y notas. */
@Component({
  selector: 'app-menu',
  imports: [Pesos, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  private readonly categoriaService = inject(CategoriaService);
  private readonly productoService = inject(ProductoService);
  protected readonly carrito = inject(CarritoService);

  protected readonly sabores = SABORES;
  protected readonly toppings = TOPPINGS;

  private readonly categorias = signal<Categoria[]>([]);
  private readonly productos = signal<Producto[]>([]);

  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly categoriaActiva = signal<number | null>(null);

  // Panel de personalización abierto (un producto a la vez).
  protected readonly abierto = signal<number | null>(null);
  protected readonly saboresElegidos = signal<string[]>([]);
  protected readonly toppingsElegidos = signal<string[]>([]);
  protected readonly notas = signal('');

  // Mensaje para lectores de pantalla cuando se agrega algo al pedido.
  protected readonly aviso = signal('');

  /** Solo se muestran las categorías que tienen al menos un producto disponible. */
  protected readonly categoriasConProductos = computed(() =>
    this.categorias().filter((c) => this.productos().some((p) => p.categoriaId === c.categoriaId)));

  protected readonly productosVisibles = computed(() =>
    this.productos().filter((p) => p.categoriaId === this.categoriaActiva()));

  constructor() {
    this.cargar();
  }

  protected cargar() {
    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      categorias: this.categoriaService.obtenerTodos(),
      productos: this.productoService.obtenerTodos(),
    }).subscribe({
      next: ({ categorias, productos }) => {
        const visibles = categorias.filter((c) => !mismoNombre(c.nombre, CATEGORIA_EXTRAS));
        const idsVisibles = new Set(visibles.map((c) => c.categoriaId));

        this.categorias.set(visibles);
        // El backend devuelve también los productos inactivos y los de la categoría de extras;
        // el cliente no debe verlos.
        this.productos.set(productos.filter((p) => p.activo && idsVisibles.has(p.categoriaId)));
        this.categoriaActiva.set(this.categoriasConProductos()[0]?.categoriaId ?? null);
        this.cargando.set(false);
      },
      error: (e: unknown) => {
        this.error.set(e instanceof ApiError ? e.message : 'No se pudo cargar el menú.');
        this.cargando.set(false);
      },
    });
  }

  protected elegirCategoria(categoriaId: number) {
    this.categoriaActiva.set(categoriaId);
    this.cerrarPanel();
  }

  protected esPersonalizable(producto: Producto): boolean {
    const categoria = this.categorias().find((c) => c.categoriaId === producto.categoriaId);
    return !!categoria && mismoNombre(categoria.nombre, CATEGORIA_PERSONALIZABLE);
  }

  protected alternarPanel(producto: Producto) {
    if (this.abierto() === producto.productoId) {
      this.cerrarPanel();
      return;
    }
    this.cerrarPanel();
    this.abierto.set(producto.productoId);
  }

  /** Marca o desmarca una opción, manteniendo el orden de la lista original. */
  protected alternarOpcion(elegidas: WritableSignal<string[]>, opcion: string, orden: readonly string[]) {
    elegidas.update((actuales) =>
      (actuales.includes(opcion) ? actuales.filter((o) => o !== opcion) : [...actuales, opcion])
        .sort((a, b) => orden.indexOf(a) - orden.indexOf(b)));
  }

  protected escribirNotas(texto: string) {
    this.notas.set(texto);
  }

  protected agregarDirecto(producto: Producto) {
    this.carrito.agregar({ producto });
    this.anunciar(producto);
  }

  protected agregarPersonalizado(producto: Producto) {
    this.carrito.agregar({
      producto,
      sabores: this.saboresElegidos(),
      toppings: this.toppingsElegidos(),
      observaciones: this.notas(),
    });
    this.anunciar(producto);
    this.cerrarPanel();
  }

  private cerrarPanel() {
    this.abierto.set(null);
    this.saboresElegidos.set([]);
    this.toppingsElegidos.set([]);
    this.notas.set('');
  }

  private anunciar(producto: Producto) {
    this.aviso.set(`Agregado: ${producto.nombre}. Productos en tu pedido: ${this.carrito.cantidadTotal()}.`);
  }
}
