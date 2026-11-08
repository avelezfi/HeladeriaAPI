import { Injectable, signal } from '@angular/core';
import { Mesa } from '../models/mesa.model';

const CLAVE = 'heladapp.mesa';

/** Mesa en la que está el cliente. Se guarda en sessionStorage para sobrevivir a una recarga. */
@Injectable({
  providedIn: 'root',
})
export class MesaSesionService {

  private readonly _mesa = signal<Mesa | null>(this.leer());

  readonly mesa = this._mesa.asReadonly();

  establecer(mesa: Mesa) {
    this._mesa.set(mesa);
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(mesa));
    } catch {
      // Sin almacenamiento disponible: la mesa se mantiene solo en memoria.
    }
  }

  limpiar() {
    this._mesa.set(null);
    try {
      sessionStorage.removeItem(CLAVE);
    } catch {
      // Nada que limpiar.
    }
  }

  private leer(): Mesa | null {
    try {
      const guardado = sessionStorage.getItem(CLAVE);
      return guardado ? (JSON.parse(guardado) as Mesa) : null;
    } catch {
      return null;
    }
  }
}
