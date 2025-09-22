import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private isDarkMode = false;
  private darkModeClass = 'dark-mode';

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle(this.darkModeClass, this.isDarkMode);
    return this.isDarkMode;
  }

  getTheme() {
    return this.isDarkMode;
  }
}
