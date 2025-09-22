import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DarkModeService } from '@src/app/core/services/DarkMode/dark-mode.service';
import { TieredAlbums, AlbumTiers, AlbumData } from '@src/app/shared/models/album';
import { GetAlbumService } from '@features/home/get-album/get-album.service';

@Component({
  selector: 'tier-list',
  imports: [TableModule, CommonModule, DialogModule, CarouselModule, ButtonModule],
  templateUrl: './tier-list.component.html'
})

export class TierListComponent implements OnInit {
  //Variables
  readonly tierOrder = Object.values(AlbumTiers);
  albumDialogVisible = false;
  selectedAlbum: AlbumData | null = null;
  selectedTier: string | null = null;
  albumList: TieredAlbums | null = null;

  //Constructor
  constructor(private albumService: GetAlbumService, private cdr: ChangeDetectorRef, private darkMode: DarkModeService) { }

  ngOnInit() {
    this.albumService.getAlbumList().subscribe(data => {
      this.albumList = data;
      this.cdr.detectChanges();
    });
  }

  //Sort tiers according to AlbumTiers
  sortByTier = (a: any, b: any): number => {
    return this.tierOrder.indexOf(a.key) - this.tierOrder.indexOf(b.key);
  };

  get isDarkMode() {
    return this.darkMode.getTheme();
  }

  getGenres(genres: any): string {
    if (!genres || genres.length === 0) return '-';

    const genreList = Array.isArray(genres) ? genres : [genres];

    return genreList
      .map((g: string) =>
        g
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      )
      .join(', ');
  }

  responsiveOptions = [
    {
      breakpoint: '1536px',
      numVisible: 5,
      numScroll: 5
    },
    {
      breakpoint: '1280px',
      numVisible: 4,
      numScroll: 4
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },

  ];

  openAlbumDialog(album: AlbumData, tier: string) {
    this.selectedAlbum = album;
    this.albumDialogVisible = true;
    this.selectedTier = tier;
  }

  closeDialog() {
    this.selectedAlbum = null;
    this.albumDialogVisible = false;
    this.selectedTier = null;
  }
}