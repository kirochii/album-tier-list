import { Component, signal } from '@angular/core';
import { Home } from '@src/app/features/home/home.component'
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('angularWebsite');
}
