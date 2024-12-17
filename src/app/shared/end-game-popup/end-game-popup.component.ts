import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-end-game-popup',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './end-game-popup.component.html',
  styleUrl: './end-game-popup.component.scss'
})
export class EndGamePopupComponent {
  @Input() winnerName: string = "Player 1";
  @Input() player1Name: string = "Player 1";
  @Input() player2Name: string = "Player 2";
  @Input() player1Score: number = 0;
  @Input() player2Score: number = 0;

}
