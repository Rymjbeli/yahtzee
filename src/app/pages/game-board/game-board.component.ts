import {Component, inject, Input} from '@angular/core';
import { ScorecardComponent } from "../../shared/components/scorecard/scorecard.component";
import { ButtonRollComponent } from "../../shared/components/buttons/button-roll/button-roll.component";
import {Observable} from "rxjs";
import {GameState} from "../../shared/interfaces/game-state";
import {GameService} from "../../shared/services/game.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [ScorecardComponent, ButtonRollComponent, AsyncPipe],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  // @Input() playersNames: string[] = ['Player 1', 'Player 2'];
  state: 'normal' | 'disabled' = 'normal';
  buttonText: 'Roll Dice' | 'Reroll Dice' = 'Roll Dice';
  // currentPlayer: number = 0;

  gameState$: Observable<GameState> = this.gameService.gameState$;
  constructor(private gameService: GameService) {}
}
