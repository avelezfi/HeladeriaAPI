import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Api } from './api';
import { Mesa } from '../models/mesa.model';

@Injectable({
  providedIn: 'root',
})
export class MesaService {

  private readonly endpoint = 'Mesas';

  constructor(private api: Api) { }

  obtenerTodos() {
    return this.api.get<Mesa[]>(this.endpoint);
  }

  obtenerPorId(id: number) {
    return this.api.get<Mesa>(`${this.endpoint}/${id}`);
  }

  /**
   * La API solo busca mesas por id, pero el cliente conoce el número de su mesa.
   * Se busca en la lista completa; devuelve undefined si no existe.
   */
  obtenerPorNumero(numero: number) {
    return this.obtenerTodos().pipe(map((mesas) => mesas.find((mesa) => mesa.numero === numero)));
  }

}
