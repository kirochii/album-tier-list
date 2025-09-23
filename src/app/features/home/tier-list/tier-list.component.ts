import { Component, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DarkModeService } from '@src/app/core/services/DarkMode/dark-mode.service';
import { TieredAlbums, AlbumTiers, MinimalAlbumData, AlbumData } from '@src/app/shared/models/album';
import { GetAlbumService } from '@features/home/get-album/get-album.service';
import { formatTextList } from '@src/app/shared/utils/text-helpers';

@Component({
  selector: 'tier-list',
  imports: [TableModule, CommonModule, DialogModule, CarouselModule, ButtonModule, ProgressSpinnerModule],
  styleUrls: ['./tier-list.component.scss'],
  templateUrl: './tier-list.component.html'
})

export class TierListComponent {
  //Variables
  readonly tierOrder = Object.values(AlbumTiers);
  albumDialogVisible = false;
  selectedAlbum: AlbumData | null = null;
  selectedTier: string | null = null;
  albumList: TieredAlbums | null = null;

  //Constructor
  constructor(
    private albumService: GetAlbumService,
    private cdr: ChangeDetectorRef,
    private darkMode: DarkModeService
  ) { }

  ngAfterViewInit() {
    this.albumService.getAlbumList().subscribe(data => {
      this.albumList = data;
      this.cdr.detectChanges();
    });
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

  //Sort tiers according to AlbumTiers
  sortByTier = (a: any, b: any): number => {
    return this.tierOrder.indexOf(a.key) - this.tierOrder.indexOf(b.key);
  };

  get isDarkMode() {
    return this.darkMode.getTheme();
  }

  formatAlbumGenres(genres: readonly string[] | string | null | undefined): string | null {
    return formatTextList(genres as string[] | string | null | undefined);
  }

  openAlbumDialog(album: MinimalAlbumData, tier: string) {
    this.albumDialogVisible = true;
    this.selectedTier = tier;

    this.albumService.getAPIAlbumDetails(album.id).subscribe(albumData => {
      this.selectedAlbum = albumData;
      this.cdr.markForCheck();
    });
  }

  closeDialog() {
    this.selectedAlbum = null;
    this.albumDialogVisible = false;
    this.selectedTier = null;
  }

  progressspinner = {
    colorScheme: {
      light: {
        root: {
          colorOne: '{sky.500}',
          colorTwo: '{sky.500}',
          colorThree: '{sky.500}',
          colorFour: '{sky.500}',
        }
      },
      dark: {
        root: {
          colorOne: '{sky.300}',
          colorTwo: '{sky.300}',
          colorThree: '{sky.300}',
          colorFour: '{sky.300}',
        }
      }
    }
  }
}