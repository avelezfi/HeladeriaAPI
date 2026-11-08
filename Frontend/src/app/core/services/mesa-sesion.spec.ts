import { TestBed } from '@angular/core/testing';
import { MesaSesionService } from './mesa-sesion';

describe('MesaSesionService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('empieza sin mesa', () => {
    expect(TestBed.inject(MesaSesionService).mesa()).toBeNull();
  });

  it('establece y limpia la mesa', () => {
    const s = TestBed.inject(MesaSesionService);
    s.establecer({ mesaId: 2, numero: 2, estado: 'Disponible' });
    expect(s.mesa()?.numero).toBe(2);
    expect(sessionStorage.getItem('heladapp.mesa')).toContain('"numero":2');
    s.limpiar();
    expect(s.mesa()).toBeNull();
    expect(sessionStorage.getItem('heladapp.mesa')).toBeNull();
  });
});
