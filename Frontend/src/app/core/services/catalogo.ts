import { Injectable, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { MesaService } from './mesa';
import { ProductoService } from './producto';

/**
 * Nombres de productos y números de mesa para mostrar en pedidos, que solo traen ids.
 * Se piden una vez y se reutilizan mientras la pestaña esté abierta.
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  private readonly productoService = inject(ProductoService);
  private readonly mesaService = inject(MesaService);

  readonly nombresProductos$ = this.productoService.obtenerTodos().pipe(
    map((lista) => new Map(lista.map((p) => [p.productoId, p.nombre] as const))),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  readonly numerosMesa$ = this.mesaService.obtenerTodos().pipe(
    map((lista) => new Map(lista.map((m) => [m.mesaId, m.numero] as const))),
    shareReplay({ bufferSize: 1, refCount: false }),
  );
}
