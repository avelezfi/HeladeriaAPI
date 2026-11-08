import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../core/models/api-error.model';
import { MesaService } from '../../core/services/mesa';
import { MesaSesionService } from '../../core/services/mesa-sesion';

/**
 * Pantalla de inicio. El cliente llega con un enlace /mesa/:numero (código QR)
 * o escribe el número de su mesa a mano.
 */
@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inicio {
  private readonly mesaService = inject(MesaService);
  private readonly sesion = inject(MesaSesionService);
  private readonly router = inject(Router);

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    const numeroEnRuta = inject(ActivatedRoute).snapshot.paramMap.get('numero');
    if (numeroEnRuta !== null) {
      this.validarYBuscar(numeroEnRuta);
    }
  }

  protected ingresar(evento: Event, texto: string) {
    evento.preventDefault();
    this.validarYBuscar(texto);
  }

  private validarYBuscar(texto: string) {
    const numero = Number(texto.trim());
    if (!texto.trim() || !Number.isInteger(numero) || numero < 1) {
      this.error.set('Escribe el número de tu mesa, por ejemplo 3.');
      return;
    }
    this.buscar(numero);
  }

  private buscar(numero: number) {
    this.cargando.set(true);
    this.error.set(null);

    this.mesaService
      .obtenerPorNumero(numero)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (mesa) => {
          if (!mesa) {
            this.error.set(`No encontramos la mesa ${numero}. Revisa el número que aparece en tu mesa.`);
            return;
          }
          this.sesion.establecer(mesa);
          this.router.navigateByUrl('/menu');
        },
        error: (e: unknown) =>
          this.error.set(e instanceof ApiError ? e.message : 'No se pudo buscar la mesa. Inténtalo de nuevo.'),
      });
  }
}
