import { Injectable } from '@angular/core';
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

}
