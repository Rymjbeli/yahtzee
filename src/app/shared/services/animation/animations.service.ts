import { Injectable } from '@angular/core';
import confetti from "canvas-confetti";
import {GameService} from "../game/game.service";

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {


  displayYahtzee(picked: boolean, nbrOfYahtzee: number): void {
    const messageElement = document.getElementById('yahtzee-message');
    if (messageElement) {
      messageElement.style.display = 'flex';
    }

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
