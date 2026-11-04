import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Preparacion } from './preparacion';

describe('Preparacion', () => {
  let component: Preparacion;
  let fixture: ComponentFixture<Preparacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Preparacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Preparacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
