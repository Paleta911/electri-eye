import { TestBed } from '@angular/core/testing';

import { RostrosService } from './rostros.service';

describe('RostrosService', () => {
  let service: RostrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RostrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
