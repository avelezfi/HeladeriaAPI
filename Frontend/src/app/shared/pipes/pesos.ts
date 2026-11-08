import { Pipe, PipeTransform, LOCALE_ID, inject } from '@angular/core';
import { formatNumber } from '@angular/common';

/**
 * Formatea un valor como pesos colombianos sin decimales y sin espacio: $5.500.
 * El pipe `currency` con es-CO escribiría "$ 5.500", que no es el formato del diseño.
 */
@Pipe({
  name: 'pesos',
})
export class Pesos implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(valor: number | null | undefined): string {
    return `$${formatNumber(valor ?? 0, this.locale, '1.0-0')}`;
  }
}
