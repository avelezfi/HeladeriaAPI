import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { Pesos } from './pesos';

describe('Pesos', () => {
  registerLocaleData(localeEsCo);
  const pipe = () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }] });
    return TestBed.runInInjectionContext(() => new Pesos());
  };

  it('formatea con punto de miles', () => expect(pipe().transform(5500)).toBe('$5.500'));
  it('formatea cero', () => expect(pipe().transform(0)).toBe('$0'));
  it('trata null como cero', () => expect(pipe().transform(null)).toBe('$0'));
});
