import {inject, Injectable} from '@angular/core';
import {Dice} from "../../models/dice";
import {DiceService} from "./dice.service";
import {ScoreCard, ScoreCardItem} from "../../interfaces/score-card";

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  diceService = inject(DiceService);

  calculateUpperSection(dice: Dice[], targetValue: number): number {
    return dice.filter(die => die.value === targetValue).reduce((sum, die) => sum + die.value, 0);
  }

  calculateThreeOfAKind(dice: Dice[]): number {
    const counts = this.diceService.getDiceCounts(dice);
    if (Object.values(counts).some(count => count >= 3)) {
      return dice.reduce((sum, die) => sum + die.value, 0);
    }
    return 0;
  }

  calculateFourOfAKind(dice: Dice[]): number {
    const counts = this.diceService.getDiceCounts(dice);
    if (Object.values(counts).some(count => count >= 4)) {
      return dice.reduce((sum, die) => sum + die.value, 0);
    }
    return 0;
  }

  calculateFullHouse(dice: Dice[]): number {
    const counts = this.diceService.getDiceCounts(dice);
    const values = Object.values(counts);
    if (values.includes(3) && values.includes(2)) {
      return 25;
    }
    return 0;
  }

  calculateSmallStraight(dice: Dice[]): number {
    const uniqueValues = Array.from(new Set(dice.map(die => die.value))).sort();
    const straights = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
    for (const straight of straights) {
      if (straight.every(num => uniqueValues.includes(num))) {
        return 30;
      }
    }
    return 0;
  }

  calculateLargeStraight(dice: Dice[]): number {
    const uniqueValues = Array.from(new Set(dice.map(die => die.value))).sort();
    const straight = [1, 2, 3, 4, 5].every(num => uniqueValues.includes(num)) ||
      [2, 3, 4, 5, 6].every(num => uniqueValues.includes(num));
    return straight ? 40 : 0;
  }

  calculateChance(dice: Dice[]): number {
    return dice.reduce((sum, die) => sum + die.value, 0);
  }

  calculateYahtzee(dice: Dice[]): number {
    const counts = this.diceService.getDiceCounts(dice);
    return Object.values(counts).includes(5) ? 50 : 0;
  }

  getAppropriateUpperSectionKeyForYahtzee(dice: Dice[]): string {
    const value = dice[0]?.value; // All dice have the same value in Yahtzee
    const mapping = new Map<number, string>([
      [1, 'aces'],
      [2, 'twos'],
      [3, 'threes'],
      [4, 'fours'],
      [5, 'fives'],
      [6, 'sixes']
    ]);
    return mapping.get(value) || '';
  }

  /**
   * Recalculates the special scores of the scorecard
   * @param scoreCard
   * @param dice
   * @private
   */
  applyYahtzeeBonus(scoreCard: ScoreCard, dice: Dice[]): void {
    const upperSectionKey = this.getAppropriateUpperSectionKeyForYahtzee(dice);
    console.log("appropriate", upperSectionKey);

    scoreCard.total += 100;

    if (scoreCard[upperSectionKey]?.picked) {
      this.recalculateSpecialScores(scoreCard);
    }
  }

  /**
   * Recalculates the special scores of the scorecard
   * @param scoreCard
   * @private
   */
  private recalculateSpecialScores(scoreCard: ScoreCard): void {
    this.updateScoreIfNotPicked(scoreCard.fullHouse, 25);
    this.updateScoreIfNotPicked(scoreCard.smallStraight, 30);
    this.updateScoreIfNotPicked(scoreCard.largeStraight, 40);
  }

  /**
   * Updates the score of a section if it has not been picked
   * @param section
   * @param value
   * @private
   */
  private updateScoreIfNotPicked(section: ScoreCardItem, value: number): void {
    if (!section.picked) {
      section.value = value;
    }
  }


}
