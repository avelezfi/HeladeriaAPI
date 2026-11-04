
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {

  private readonly baseUrl = 'https://localhost:7070/api';

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
