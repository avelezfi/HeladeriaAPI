import { Injectable } from '@angular/core';
import { Api } from './api';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private readonly endpoint = 'Productos';

  constructor(private api: Api) { }

  obtenerTodos() {
    return this.api.get<Producto[]>(this.endpoint);
  }

  obtenerPorId(id: number) {
    return this.api.get<Producto>(`${this.endpoint}/${id}`);
  }

}
