import { Injectable } from '@angular/core';
import {Dice} from "../../models/dice";
import {Position} from "../../interfaces/position";
import {GameState} from "../../interfaces/game-state";

@Injectable({
  providedIn: 'root'
})
export class DiceService {

  /**
   * Rolls all dice that are not held
    * @param dice
   * @param rollsLeft
   */
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

  /**
   * Returns the counts of each dice value
   * @param dice
   */
  getDiceCounts(dice: Dice[]): { [key: number]: number } {
    return dice.reduce((counts, die) => {
      counts[die.value] = (counts[die.value] || 0) + 1;
      return counts;
    }, {} as { [key: number]: number });
  }

  calculateTotal(dice: Dice[]): number {
    return dice.reduce((total, die) => total + die.value, 0);
  }

  /**
   * Get the positions of the dice.
   */
  getDicePositions(index: number, gameState: GameState): Position {
    const positions = gameState.dicePositions;
    if (positions && positions[index]) {
      return positions[index];
    }
    return { top: '50%', left: '50%', transform: 'rotate(0deg)' };
  }
}
