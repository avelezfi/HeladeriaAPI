import { ApiError } from '../models/api-error.model';

/** Mensaje legible para mostrar al usuario a partir de cualquier error. */
export function mensajeError(e: unknown, porDefecto: string): string {
  return e instanceof ApiError ? e.message : porDefecto;
}
