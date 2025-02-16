import {Component, HostListener, inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { ScorecardComponent } from "../../shared/components/scorecard/scorecard.component";
import { ButtonRollComponent } from "../../shared/components/buttons/button-roll/button-roll.component";
import { filter} from "rxjs";
import { AsyncPipe, isPlatformBrowser, NgClass, NgOptimizedImage, NgStyle } from "@angular/common";
import { Position } from "../../shared/interfaces/position";
import { MatDialog } from "@angular/material/dialog";
import { EndGamePopupComponent } from "../../shared/components/popups/end-game-popup/end-game-popup.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SoundService} from "../../shared/services/settings/sound.service";
import {GameManagerService} from "../../shared/services/game/game-manager.service";
import {CONSTANTS} from "../../../config/const.config";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [ScorecardComponent, ButtonRollComponent, AsyncPipe, NgOptimizedImage, NgClass, NgStyle, TranslatePipe],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit, OnDestroy {
  gameManagerService = inject(GameManagerService);
  translateService = inject(TranslateService);
  gameService = this.gameManagerService.currentGameService;
  soundService = inject(SoundService);
  dialog = inject(MatDialog);
  platformId = inject(PLATFORM_ID);
  gameState$ = this.gameService?.gameState$;
  beforeGame = this.gameService?.beforeGame;
  gameMode = this.gameManagerService.gameMode;

  total1 = this.gameService?.total1!;
  total2 = this.gameService?.total2!;
  gameEnded = this.gameService?.gameEnded;
  yahtzee = 'yahtzee';
  startMessage: string = '';
  quitGameAlert: string = '';

  constructor() {
    this.gameEnded.pipe(takeUntilDestroyed()).pipe(filter(x=>x==1)).subscribe(()=>{
      this.openEndGamePopup(true);
    });
    if (isPlatformBrowser(this.platformId)) {
      // Push the initial state into the history stack only in the browser
      window.history.pushState(null, '', window.location.href);
    }

    this.translateService
      .stream('game_board.startMessage')
      .pipe(takeUntilDestroyed())
      .subscribe((res: string) => {
        this.startMessage = res;
      });
    this.translateService
      .stream('game_board.quit_game_alert')
      .pipe(takeUntilDestroyed())
      .subscribe((res: string) => {
        this.quitGameAlert = res;
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
        player1Score: this.gameService?.total1(),
        player2Score: this.gameService?.total2()
      }
    });
  }

  get isRollButtonDisabled(): boolean {
    const rollsLeft = this.gameService?.getGameStateValue()?.rollsLeft ?? 0;

    const yahtzeeScore = this.gameService?.getYahtzeeScore()
    const nbrOfYahtzee = this.gameService?.getNbrOfYahtzee();

    return rollsLeft === 0 || (yahtzeeScore > 0 && rollsLeft < 3 && nbrOfYahtzee < 4);
  }

  get rollButtonText() {
    return this.gameService?.getGameStateValue()?.rollsLeft === 3 ? 'game_board.roll_dice' : 'game_board.reroll_dice';
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.preventDefault();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const confirmNavigation = confirm(this.quitGameAlert);
      if (!confirmNavigation) {
        // Push the state back to prevent navigation
        window.history.pushState(null, '', window.location.href);
      } else {
        this.gameService.resetGame();
      }
    }
  }

  getFormattedTimeLeft(): string {
    const currentPlayer = this.gameService?.getGameStateValue().currentPlayerIndex;
    const timeLeft = this.gameService?.getGameStateValue().players[currentPlayer].timeLeft;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get enableTimer() {
    const gameMode = this.gameManagerService.gameMode;
    return gameMode === CONSTANTS.GAME_MODE.LOCAL && this.gameService.getTimerState()
  }
}
