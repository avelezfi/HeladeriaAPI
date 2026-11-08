/** Error de la API ya traducido a un mensaje legible para el usuario. */
export class ApiError extends Error {
  readonly status: number;

  constructor(mensaje: string, status: number) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
  }
}
