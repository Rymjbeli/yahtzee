import {Component, inject, Inject, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ButtonPrimaryComponent} from "../../buttons/button-primary/button-primary.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GameService} from "../../../services/game/game.service";
import {BaseGameService} from "../../../services/game/base-game.service";

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

  private dialogRef = inject(MatDialogRef<EndGamePopupComponent>);
  gameService = inject(BaseGameService);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.player1Name = data.player1Name;
    this.player2Name = data.player2Name;
    this.player1Score = data.player1Score;
    this.player2Score = data.player2Score;
    this.checkWinner();
  }

  closeDialog(): void {
    this.gameService.resetGame();
    this.dialogRef.close();
  }
  playAgain(): void {
    this.closeDialog();
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
}
