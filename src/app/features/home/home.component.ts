import { Component } from '@angular/core';
import { DarkModeToggleComponent } from "@src/app/shared/components/dark-mode-toggle/dark-mode-toggle.component";
import { TierListComponent } from './tier-list/tier-list.component';
import { BackgroundBlurComponent } from '@src/app/shared/components/background-blur/background-blur.component';
import { DailyRecommendationComponent } from './daily-recommendation/daily-recommendation.component';

@Component({
  selector: 'app-home',
  imports: [DarkModeToggleComponent, TierListComponent, BackgroundBlurComponent, DailyRecommendationComponent],
  templateUrl: './home.component.html',
})

export class Home {

}