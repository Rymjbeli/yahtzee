import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScorecardComponent } from "./shared/scorecard/scorecard.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScorecardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'yahtzee';
}
