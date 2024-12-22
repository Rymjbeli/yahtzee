import {ScoreCard} from "../interfaces/score-card";

export class Player {
  name: string;
  scoreCard: ScoreCard;
  timeLeft: number;

  constructor(name: string) {
    this.name = name;
    this.scoreCard = {
      aces: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      chance: null,
      yahtzee: null,
      bonus: null,
      total: null
    };
    this.timeLeft = 30;
  }
}
