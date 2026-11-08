import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { mesaGuard } from './mesa';
import { MesaSesionService } from '../services/mesa-sesion';

describe('mesaGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  const ejecutar = () => TestBed.runInInjectionContext(() => mesaGuard({} as never, {} as never));

  it('redirige al inicio si no hay mesa', () => {
    const r = ejecutar() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(r)).toBe('/');
  });

  it('deja pasar si hay mesa', () => {
    TestBed.inject(MesaSesionService).establecer({ mesaId: 1, numero: 1, estado: 'Disponible' });
    expect(ejecutar()).toBe(true);
  });
});
