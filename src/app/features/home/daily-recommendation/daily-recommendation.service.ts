import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlbumData } from '@src/app/shared/models/album';

@Injectable({
  providedIn: 'root'
})
export class DailyRecommendationService {
  private todaysAlbumSubject = new BehaviorSubject<AlbumData | undefined>(undefined);

  // Observable streams for subscribers
  todaysAlbum$ = this.todaysAlbumSubject.asObservable();

  // Method to update the album
  setTodaysAlbum(album: AlbumData) {
    this.todaysAlbumSubject.next(album);
  }
}
