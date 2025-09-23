import { ChangeDetectorRef, Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { GetAlbumService } from '../get-album/get-album.service';
import { TieredAlbums, AlbumData, AlbumTiers } from '@src/app/shared/models/album';
import { DarkModeService } from '@src/app/core/services/DarkMode/dark-mode.service';
import { DailyRecommendationService } from './daily-recommendation.service';
import { CommonModule } from '@angular/common';
import { formatTextList } from '@src/app/shared/utils/text-helpers';

@Component({
  selector: 'daily-recommendation',
  imports: [PanelModule, ButtonModule, CommonModule],
  templateUrl: './daily-recommendation.component.html'
})

export class DailyRecommendationComponent {
  albumList?: TieredAlbums;
  todaysAlbum?: AlbumData;
  todaysTier?: AlbumTiers;
  TIMEZONE = 'Asia/Kuala_Lumpur';

  // Define tiers and weights
  tiers: AlbumTiers[] = [AlbumTiers.S, AlbumTiers.A, AlbumTiers.B, AlbumTiers.C];
  weights: number[] = [20, 40, 30, 10];

  //Constructor
  constructor(
    private albumService: GetAlbumService,
    private cdr: ChangeDetectorRef,
    private darkMode: DarkModeService,
    private dailyRecommendationService: DailyRecommendationService
  ) { }

  ngOnInit() {
    this.albumService.getAlbumList().subscribe(data => {
      this.albumList = data;
      this.selectRandomAlbum();
      this.cdr.detectChanges();
    });
  }

  get isDarkMode() {
    return this.darkMode.getTheme();
  }

  // Convert date string to a pseudo-random number
  private hashDate(dateStr: string): number {
    let hash = 2166136261; // FNV offset basis
    for (let i = 0; i < dateStr.length; i++) {
      hash ^= dateStr.charCodeAt(i);
      hash = Math.imul(hash, 16777619); // FNV prime
    }
    return Math.abs(hash);
  }

  private selectRandomAlbum() {
    if (!this.albumList) return;

    // Get today's date in YYYY-MM-DD format
    const todayDate = new Intl.DateTimeFormat('en-US', {
      timeZone: this.TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    // Hash function to convert date string to number
    const hash = this.hashDate(todayDate);

    // Use hash to deterministically pick a tier
    const totalWeight = this.weights.reduce((sum, w) => sum + w, 0);
    let randomNum = hash % totalWeight;

    let selectedTier: AlbumTiers | undefined;
    for (let i = 0; i < this.tiers.length; i++) {
      if (!this.albumList.tieredAlbums[this.tiers[i]] || this.albumList.tieredAlbums[this.tiers[i]]!.length === 0) {
        continue; // skip empty tiers
      }
      if (randomNum < this.weights[i]) {
        selectedTier = this.tiers[i];
        break;
      }
      randomNum -= this.weights[i];
    }

    if (!selectedTier) {
      console.warn('No album found in the selected tiers');
      return;
    }

    // Pick album from selected tier
    const albums = this.albumList.tieredAlbums[selectedTier]!;
    const albumIndex = hash % albums.length;
    const randomAlbum = albums[albumIndex];

    this.albumService.getAPIAlbumDetails(randomAlbum.id).subscribe(fullAlbumData => {
      this.todaysAlbum = fullAlbumData;
      this.todaysTier = selectedTier;

      this.dailyRecommendationService.setTodaysAlbum(this.todaysAlbum);

      this.cdr.detectChanges();
    });
  }

  formatAlbumGenres(genres: readonly string[] | string | null | undefined): string | null {
    return formatTextList(genres as string[] | string | null | undefined);
  }

}
