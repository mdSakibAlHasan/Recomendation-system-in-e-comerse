import { TestBed } from '@angular/core/testing';

import { SuperUserService } from './super-user.service';

describe('SuperUserService', () => {
  let service: SuperUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
