import { Component, HostListener, inject, Input } from '@angular/core';
import { ScorecardComponent } from "../../shared/components/scorecard/scorecard.component";
import { ButtonRollComponent } from "../../shared/components/buttons/button-roll/button-roll.component";
import { Observable } from "rxjs";
import { GameState } from "../../shared/interfaces/game-state";
import { GameService } from "../../shared/services/game/game.service";
import { AsyncPipe, NgClass, NgOptimizedImage, NgStyle } from "@angular/common";
import { Position } from "../../shared/interfaces/position";
import { MatDialog } from "@angular/material/dialog";
import { EndGamePopupComponent } from "../../shared/components/popups/end-game-popup/end-game-popup.component";
import confetti from "canvas-confetti";
import { RulesService } from '../../shared/services/game/rules.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [ScorecardComponent, ButtonRollComponent, AsyncPipe, NgOptimizedImage, NgClass, NgStyle],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  gameService = inject(GameService);
  rulesService = inject(RulesService);
  dialog = inject(MatDialog);
  gameState$: Observable<GameState> = this.gameService.gameState$;

  total1 = 0;
  total2 = 0;

  yahtzee = 'yahtzee';
  nbrOfYahtzee = 'nbrOfYahtzee';
  toggleHold(index: number): void {
    if (this.gameService.getGameStateValue().rollsLeft === 3) return;
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
    const game = this.gameService.getGameStateValue();
    let currentPlayer = game.currentPlayerIndex;

    if (this.gameService.rollCounter === 0) {

      this.total1 = this.gameService.rollStart(game.currentPlayerIndex);
      this.gameService.rollCounter++;

    } else if (this.gameService.rollCounter === 1) {

      this.total2 = this.gameService.rollStart(game.currentPlayerIndex);
      currentPlayer = this.total1 > this.total2 ? 0 : 1;

      setTimeout(() => {
        this.gameService.rollCounter++;
      }, 3000);

      this.gameService.updateGameState({ currentPlayerIndex: currentPlayer });

    } else {

      this.gameService.rollDice();

      this.gameService.calculateScoreCard(currentPlayer);

      const yahtzee = this.rulesService.calculateYahtzee(game.dice) > 0;
      const picked = game.players[currentPlayer].scoreCard.yahtzee.picked;

      if (yahtzee && !picked)
        this.displayYahtzee(false);
      if (yahtzee && picked)
        this.displayYahtzee(true);
    }
  }

  scoreChosen(score: string): void {
    this.gameService.scoreChosen(score);

    if (this.gameService.gameIsOver()) {
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
    const yahtzeeScore = this.rulesService.calculateYahtzee(this.gameService.getGameStateValue().dice);
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

  getFormattedTimeLeft(): string {
    const currentPlayer = this.gameService.getGameStateValue().currentPlayerIndex;
    const timeLeft = this.gameService.getGameStateValue().players[currentPlayer].timeLeft;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  displayYahtzee(picked: boolean): void {
    const messageElement = document.getElementById('yahtzee-message');
    if (messageElement) {
      messageElement.style.display = 'flex';
    }

    if (picked) {
      const message = document.getElementById('second-time');
      if (message) {
        message.style.display = 'flex';
      }
    }

    confetti({
      particleCount: 400,
      spread: 100,
      origin: { y: 0.7 },
      zIndex: 1001,
    });

    setTimeout(() => {
      if (messageElement) {
        messageElement.style.display = 'none';
      }
    }, 3000);
  }
}
