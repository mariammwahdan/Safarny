import { TestBed } from '@angular/core/testing';

import { TripExtrasService } from './trip-extras.service';

describe('TripExtrasService', () => {
  let service: TripExtrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripExtrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
