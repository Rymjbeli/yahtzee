import {Component, HostListener, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { ScorecardComponent } from "../../shared/components/scorecard/scorecard.component";
import { ButtonRollComponent } from "../../shared/components/buttons/button-roll/button-roll.component";
import {Observable, Subject} from "rxjs";
import { GameState } from "../../shared/interfaces/game-state";
import { AsyncPipe, NgClass, NgOptimizedImage, NgStyle } from "@angular/common";
import { Position } from "../../shared/interfaces/position";
import { MatDialog } from "@angular/material/dialog";
import { EndGamePopupComponent } from "../../shared/components/popups/end-game-popup/end-game-popup.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {BaseGameService} from "../../shared/services/game/base-game.service";
import {SoundService} from "../../shared/services/settings/sound.service";
import {GameManagerService} from "../../shared/services/game/game-manager.service";

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [ScorecardComponent, ButtonRollComponent, AsyncPipe, NgOptimizedImage, NgClass, NgStyle],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit, OnDestroy {
  gameService!: BaseGameService;
  gameManagerService = inject(GameManagerService);
  soundService = inject(SoundService);
  dialog = inject(MatDialog);
  gameState$: Observable<GameState> = new Observable();
  beforeGame = signal(false);

  total1 = signal(0);
  total2 = signal(0);
  gameEnded = new Subject();
  yahtzee = 'yahtzee';
  constructor() {
    // Subscribe to the current game service
    this.gameManagerService.currentGameService
      .pipe(takeUntilDestroyed())
      .subscribe((gameService) => {
      this.gameService = gameService!;

      this.gameState$ = this.gameService?.gameState$;
      this.beforeGame = this.gameService?.beforeGame;
      this.total1 = this.gameService?.total1;
      this.total2 = this.gameService?.total2;
      this.gameEnded = this.gameService?.gameEnded;
    });

    this.gameEnded.pipe(takeUntilDestroyed()).subscribe(()=>{
      this.openEndGamePopup(true);
    });
  }
  ngOnDestroy(): void {
    this.gameService?.destroyGame();
  }

  ngOnInit(): void {
    this.gameService?.initGame();
  }
  toggleHold(index: number): void {
    this.gameService?.toggleHoldDice(index);
  }

  getDicePosition(index: number): Position {
    return this.gameService?.getDicePositions(index);
  }

  rollDice(): void {
    this.soundService.playDiceSound();
    this.gameService?.rollDice();
  }

  scoreChosen(score: string): void {
    this.gameService?.scoreChosen(score);

    if (this.gameService?.gameIsOver()) {
      this.openEndGamePopup();
    }
  }

  openEndGamePopup(disableReplay = false): void {
    this.dialog.open(EndGamePopupComponent, {
      width: '600px',
      disableClose: true,
      data: {
        player1Name: this.gameService?.getGameStateValue().players[0].name,
        player2Name: this.gameService?.getGameStateValue().players[1].name,
        player1Score: this.gameService?.getGameStateValue().players[0]?.scoreCard?.total,
        player2Score: this.gameService?.getGameStateValue().players[1]?.scoreCard?.total,
        disableReplay: disableReplay
      }
    });
  }

  get isRollButtonDisabled(): boolean {
    const rollsLeft = this.gameService?.getGameStateValue()?.rollsLeft ?? 0;

    const yahtzeeScore = this.gameService?.getYahtzeeScore()
    const nbrOfYahtzee = this.gameService?.getNbrOfYahtzee();

    return rollsLeft === 0 || (yahtzeeScore > 0 && rollsLeft < 3 && nbrOfYahtzee < 4);
  }

  get rollButtonText(): "Roll Dice" | "Reroll Dice" {
    return this.gameService?.getGameStateValue()?.rollsLeft === 3 ? 'Roll Dice' : 'Reroll Dice';
  }


  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.preventDefault();
  }

  getFormattedTimeLeft(): string {
    const currentPlayer = this.gameService?.getGameStateValue().currentPlayerIndex;
    const timeLeft = this.gameService?.getGameStateValue().players[currentPlayer].timeLeft;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

}
