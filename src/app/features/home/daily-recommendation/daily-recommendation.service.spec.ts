import { TestBed } from '@angular/core/testing';

import { DailyRecommendationService } from './daily-recommendation.service';

describe('DailyRecommendationService', () => {
  let service: DailyRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
