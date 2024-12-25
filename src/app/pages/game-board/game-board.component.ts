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
  beforeGame: boolean = false;

  total1 = this.gameService.total1$;
  total2 = this.gameService.total2$;

  yahtzee = 'yahtzee';
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

      this.gameService.updateTotal1(game.currentPlayerIndex)
      this.gameService.rollCounter++;

    } else if (this.gameService.rollCounter === 1) {

      this.gameService.updateTotal2(game.currentPlayerIndex);
      currentPlayer = this.gameService.getTotal1() > this.gameService.getTotal2() ? 0 : 1;
      this.beforeGame = true;

      setTimeout(() => {
        this.gameService.rollCounter++;
        this.beforeGame = false;

        const gameState = this.gameService.getGameStateValue();
        const dice = gameState.dice.map(die => {
          die.isHeld = true;
          return die;
        });
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

    const yahtzeeScore = this.gameService.getYahtzeeScore()
    const nbrOfYahtzee = this.gameService.getNbrOfYahtzee();

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

    const nbrOfYahtzee = this.gameService.getNbrOfYahtzee();
    const message = document.getElementById('second-time');
    if (message) {
      if (picked && nbrOfYahtzee < 5) {
        message.style.display = 'flex';
      } else {
        message.style.display = 'none';
      }
    }


    if(nbrOfYahtzee >= 5) {
      const message = document.getElementById('second-time');
      if (message) {
        message.style.display = 'none';
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
