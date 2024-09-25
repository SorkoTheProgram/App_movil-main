import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesViajeModalPage } from './detalles-viaje-modal.page';

describe('DetallesViajeModalPage', () => {
  let component: DetallesViajeModalPage;
  let fixture: ComponentFixture<DetallesViajeModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesViajeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
