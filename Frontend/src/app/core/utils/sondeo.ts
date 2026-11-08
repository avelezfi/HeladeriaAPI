import { Observable, Subject, catchError, map, merge, of, switchMap, timer } from 'rxjs';

export type ResultadoSondeo<T> = { ok: true; valor: T } | { ok: false; error: unknown };

/**
 * Consulta periódica ("polling"). El backend no tiene tiempo real, así que se vuelve a pedir
 * la información cada `cadaMs` milisegundos. Un error NO corta el sondeo: se informa y se
 * vuelve a intentar en el siguiente ciclo. Si llega una consulta nueva mientras la anterior
 * sigue en curso, la anterior se descarta (switchMap).
 */
export function sondeo<T>(
  fuente: () => Observable<T>,
  refrescar?: Subject<void>,
  cadaMs = 5000,
): Observable<ResultadoSondeo<T>> {
  const disparadores = refrescar ? merge(timer(0, cadaMs), refrescar) : timer(0, cadaMs);
  return disparadores.pipe(
    switchMap(() =>
      fuente().pipe(
        map((valor): ResultadoSondeo<T> => ({ ok: true, valor })),
        catchError((error: unknown) => of<ResultadoSondeo<T>>({ ok: false, error })),
      ),
    ),
  );
}
