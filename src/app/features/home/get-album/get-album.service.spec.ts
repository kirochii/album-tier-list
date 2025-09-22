import { TestBed } from '@angular/core/testing';

import { GetAlbumService } from './get-album.service';

describe('GetAlbumService', () => {
  let service: GetAlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAlbumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
