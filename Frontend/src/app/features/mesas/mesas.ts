import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Mesa } from '../../core/models/mesa.model';
import { MesaService } from '../../core/services/mesa';
import { mensajeError } from '../../core/utils/errores';

/** Mesas del local (solo lectura). */
@Component({
  selector: 'app-mesas',
  imports: [],
  templateUrl: './mesas.html',
  styleUrl: './mesas.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mesas {
  private readonly mesaService = inject(MesaService);

  protected readonly mesas = signal<Mesa[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.cargar();
  }

  protected cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.mesaService.obtenerTodos().subscribe({
      next: (mesas) => {
        this.mesas.set([...mesas].sort((a, b) => a.numero - b.numero));
        this.cargando.set(false);
      },
      error: (e: unknown) => {
        this.error.set(mensajeError(e, 'No se pudieron cargar las mesas.'));
        this.cargando.set(false);
      },
    });
  }
}
