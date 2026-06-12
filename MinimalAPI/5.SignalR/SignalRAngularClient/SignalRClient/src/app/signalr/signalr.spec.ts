import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signalr } from './signalr';

describe('Signalr', () => {
  let component: Signalr;
  let fixture: ComponentFixture<Signalr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signalr],
    }).compileComponents();

    fixture = TestBed.createComponent(Signalr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
