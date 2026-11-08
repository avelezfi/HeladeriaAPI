import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MesaSesionService } from '../services/mesa-sesion';

/** Sin mesa elegida no hay menú ni carrito: se vuelve a la pantalla de inicio. */
export const mesaGuard: CanActivateFn = () => {
  const sesion = inject(MesaSesionService);
  return sesion.mesa() ? true : inject(Router).parseUrl('/');
};
