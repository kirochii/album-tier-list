import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DarkModeService } from '@src/app/core/services/DarkMode/dark-mode.service';
import { CommonModule } from '@angular/common';
import { AlbumData, AlbumTiers } from '@src/app/shared/models/album';
import { DailyRecommendationService } from '@src/app/features/home/daily-recommendation/daily-recommendation.service';

@Component({
  selector: 'background-blur',
  imports: [CommonModule],
  templateUrl: './background-blur.component.html'
})
export class BackgroundBlurComponent implements OnInit {
  backgroundUrl: string | null = null;
  todaysAlbum?: AlbumData;

  constructor(
    private darkMode: DarkModeService,
    private dailyRecommendationService: DailyRecommendationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.dailyRecommendationService.todaysAlbum$.subscribe(album => { this.todaysAlbum = album; this.cdr.detectChanges(); });

    if (this.todaysAlbum?.thumbnailLarge) {
      this.setBackground(this.todaysAlbum?.thumbnailLarge);
    }
  }

  get isDarkMode() {
    return this.darkMode.getTheme();
  }

  setBackground(url: string) {
    this.backgroundUrl = url;
  }
}
