import { Component, inject, Input } from '@angular/core';
import { ScorecardComponent } from "../../shared/components/scorecard/scorecard.component";
import { ButtonRollComponent } from "../../shared/components/buttons/button-roll/button-roll.component";
import { Observable } from "rxjs";
import { GameState } from "../../shared/interfaces/game-state";
import { GameService } from "../../shared/services/game/game.service";
import { AsyncPipe, NgClass, NgIf, NgOptimizedImage, NgStyle } from "@angular/common";
import { Position } from "../../shared/interfaces/position";
import confetti from "canvas-confetti";
import { RulesService } from '../../shared/services/game/rules.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [ScorecardComponent, ButtonRollComponent, AsyncPipe, NgOptimizedImage, NgIf, NgClass, NgStyle],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  gameService = inject(GameService);
  rulesService = inject(RulesService);
  gameState$: Observable<GameState> = this.gameService.gameState$;

  toggleHold(index: number): void {
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

    const game = this.gameService.getGameStateValue();
    const currentPlayer = game.currentPlayerIndex;

    this.gameService.calculateScoreCard(currentPlayer);

    const yahtzee = this.rulesService.calculateYahtzee(game.dice) > 0;
    const picked = game.players[currentPlayer].scoreCard.yahtzee.picked;

    if (yahtzee && !picked)
      this.displayYahtzee(false);
    if (yahtzee && picked)
      this.displayYahtzee(true);
  }

  scoreChosen(score: string): void {
    this.gameService.scoreChosen(score);
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
