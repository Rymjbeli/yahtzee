import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RuleContainerComponent} from "./shared/rule-container/rule-container.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RuleContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'yahtzee';
}
