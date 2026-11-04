import { Injectable } from '@angular/core';
import { Api } from './api';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {

  private readonly endpoint = 'Categorias';

  constructor(private api: Api) { }

  obtenerTodos() {
    return this.api.get<Categoria[]>(this.endpoint);
  }

  obtenerPorId(id: number) {
    return this.api.get<Categoria>(`${this.endpoint}/${id}`);
  }

}
