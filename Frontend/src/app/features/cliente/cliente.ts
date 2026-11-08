import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MesaSesionService } from '../../core/services/mesa-sesion';

/** Marco común de las pantallas del cliente: marca, mesa actual y contenido. */
@Component({
  selector: 'app-cliente',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cliente {
  protected readonly mesa = inject(MesaSesionService).mesa;
}
