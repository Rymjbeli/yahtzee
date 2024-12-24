import {Component, HostListener, inject, Input} from '@angular/core';
import { ScorecardComponent } from "../../shared/components/scorecard/scorecard.component";
import { ButtonRollComponent } from "../../shared/components/buttons/button-roll/button-roll.component";
import {Observable} from "rxjs";
import {GameState} from "../../shared/interfaces/game-state";
import {GameService} from "../../shared/services/game/game.service";
import {AsyncPipe, NgClass, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {Position} from "../../shared/interfaces/position";
import {MatDialog} from "@angular/material/dialog";
import {EndGamePopupComponent} from "../../shared/components/popups/end-game-popup/end-game-popup.component";

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [ScorecardComponent, ButtonRollComponent, AsyncPipe, NgOptimizedImage, NgIf, NgClass, NgStyle],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  gameService = inject(GameService);
  dialog = inject(MatDialog);
  gameState$: Observable<GameState> = this.gameService.gameState$;

  yahtzee = 'yahtzee';
  nbrOfYahtzee = 'nbrOfYahtzee';
  toggleHold(index: number): void {
    if(this.gameService.getGameStateValue().rollsLeft === 3) return;
    this.gameService.toggleHoldDice(index);
  }

  getDicePosition(index: number): Position {
    const positions = this.gameService.getDicePositions();
    if (positions && positions[index]) {
      return positions[index];
    }
    return { top: '50%', left: '50%', transform: 'rotate(0deg)' };
  }

  rollDice(): void {
    this.gameService.rollDice();
    const currentPlayer = this.gameService.getGameStateValue().currentPlayerIndex;
    this.gameService.calculateScoreCard(currentPlayer);
  }

  scoreChosen(score: string): void {
    this.gameService.scoreChosen(score);

    if (this.gameService.gameIsOver()){
      this.openEndGamePopup();
    }
  }

  openEndGamePopup(): void {
    this.dialog.open(EndGamePopupComponent, {
      width: '600px',
      disableClose: true,
      data: {
        player1Name: this.gameService.getGameStateValue().players[0].name,
        player2Name: this.gameService.getGameStateValue().players[1].name,
        player1Score: this.gameService.getGameStateValue().players[0]?.scoreCard?.total,
        player2Score: this.gameService.getGameStateValue().players[1]?.scoreCard?.total
      }
    });
  }

  get isRollButtonDisabled(): boolean {
    const rollsLeft = this.gameService.getGameStateValue()?.rollsLeft ?? 0;
    const currentPlayer = this.gameService.getGameStateValue()?.players?.[
      this.gameService.getGameStateValue()?.currentPlayerIndex
      ];
    const yahtzeeScore = currentPlayer?.scoreCard?.[this.yahtzee]?.value ?? 0;
    const nbrOfYahtzee = currentPlayer?.scoreCard?.[this.nbrOfYahtzee] ?? 0;

    return rollsLeft === 0 || (yahtzeeScore > 0 && rollsLeft < 3 && nbrOfYahtzee < 4);
  }

  get rollButtonText(): "Roll Dice" | "Reroll Dice" {
    return this.gameService.getGameStateValue()?.rollsLeft === 3 ? 'Roll Dice' : 'Reroll Dice';
  }


  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.preventDefault();
  }
}
