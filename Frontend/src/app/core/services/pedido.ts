import { Injectable } from '@angular/core';
import { Api } from './api';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {

  private readonly endpoint = 'Pedidos';

  constructor(private api: Api) { }

  obtenerTodos() {
    return this.api.get<Pedido[]>(this.endpoint);
  }

  obtenerPorId(id: number) {
    return this.api.get<Pedido>(`${this.endpoint}/${id}`);
  }

}
