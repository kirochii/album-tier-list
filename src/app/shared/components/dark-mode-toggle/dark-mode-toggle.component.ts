import { Component } from '@angular/core';
import { DarkModeService } from '@core/services/DarkMode/dark-mode.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'dark-mode-toggle',
  imports: [ButtonModule],
  templateUrl: './dark-mode-toggle.component.html'
})
export class DarkModeToggleComponent {
  isDarkMode = false;

  constructor(private darkMode: DarkModeService) { }

  toggleTheme() {
    this.isDarkMode = this.darkMode.toggleTheme();
  }
}
