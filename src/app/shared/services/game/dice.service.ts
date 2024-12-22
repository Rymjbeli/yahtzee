import { Injectable } from '@angular/core';
import {Dice} from "../../models/dice";

@Injectable({
  providedIn: 'root'
})
export class DiceService {

   rollAllDice(dice: Dice[], rollsLeft: number): Dice[] {
    return dice.map(dice => {
      if (rollsLeft === 3) {
        dice.isHeld = false;
      }

      if (!dice.isHeld) {
        dice.value = dice.roll();
      }

      return dice;
    });
  }

  getDiceCounts(dice: Dice[]): { [key: number]: number } {
    return dice.reduce((counts, die) => {
      counts[die.value] = (counts[die.value] || 0) + 1;
      return counts;
    }, {} as { [key: number]: number });
  }
}
