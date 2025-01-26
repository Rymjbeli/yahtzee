import {Component, inject, Inject, Input, PLATFORM_ID} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ButtonPrimaryComponent} from "../../buttons/button-primary/button-primary.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseGameService} from "../../../services/game/base-game.service";
import {GameManagerService} from "../../../services/game/game-manager.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LocalStorageService} from "../../../services/shared/local-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-end-game-popup',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ButtonPrimaryComponent
  ],
  templateUrl: './end-game-popup.component.html',
  styleUrl: './end-game-popup.component.scss'
})
export class EndGamePopupComponent {
  winnerName: string = "Player 1";
  player1Name: string = "Player 1";
  player2Name: string = "Player 2";
  player1Score: number = 0;
  player2Score: number = 0;
  isTie = false;
  disableReplay = false;

  private dialogRef = inject(MatDialogRef<EndGamePopupComponent>);
  gameService!: BaseGameService;
  gameManagerService = inject(GameManagerService);
  private platformId = inject(PLATFORM_ID);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.player1Name = data.player1Name;
    this.player2Name = data.player2Name;
    this.player1Score = data.player1Score;
    this.player2Score = data.player2Score;
    this.disableReplay = data.disableReplay;
    this.checkWinner();

    // Subscribe to the current game service
    this.gameManagerService.currentGameService
      .pipe(takeUntilDestroyed())
      .subscribe((gameService) => {
      this.gameService = gameService!;
    });
  }

  closeDialog(): void {
    this.gameService.resetGame();
    this.dialogRef.close();
  }
  playAgain(): void {
    if(this.gameService.canPlayAgain()){
      this.closeDialog();
    }
  }

  checkWinner(): void {
    if (this.player1Score > this.player2Score) {
      this.winnerName = this.player1Name;
    } else if (this.player1Score < this.player2Score) {
      this.winnerName = this.player2Name;
    } else {
      this.isTie = true;
    }
  }

  redirectToHome(): void {
    this.localStorageService.removeData('step', this.platformId);
    this.localStorageService.removeData('gameMode', this.platformId);

    this.gameService.resetGame();
    this.router.navigate(['/']);

    this.closeDialog();
  }
}
