import { Component, Input } from '@angular/core';
import { ScorecardComponent } from "../../shared/components/scorecard/scorecard.component";
import { ButtonRollComponent } from "../../shared/components/buttons/button-roll/button-roll.component";

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [ScorecardComponent, ButtonRollComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  @Input() playersNames: string[] = ['Player 1', 'Player 2'];
  state: 'normal' | 'disabled' = 'normal';
  buttonText: 'Roll Dice' | 'Reroll Dice' = 'Roll Dice';
  currentPlayer: number = 0;

  constructor() {
    this.currentPlayer = 0;

  }


}
