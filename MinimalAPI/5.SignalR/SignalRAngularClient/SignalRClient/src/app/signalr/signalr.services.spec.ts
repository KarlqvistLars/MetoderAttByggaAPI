import { TestBed } from '@angular/core/testing';

import { SignalrServices } from './signalr.services';

describe('SignalrServices', () => {
  let service: SignalrServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
