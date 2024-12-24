import {ScoreCard} from "../interfaces/score-card";

export class Player {
  name: string;
  scoreCard: ScoreCard;
  timeLeft: number;

  constructor(name: string) {
    this.name = name;
    this.scoreCard = {
      aces: { picked: false, value: null },
      twos: { picked: false, value: null },
      threes: { picked: false, value: null },
      fours: { picked: false, value: null },
      fives: { picked: false, value: null },
      sixes: { picked: false, value: null },
      threeOfAKind: { picked: false, value: null },
      fourOfAKind: { picked: false, value: null },
      fullHouse: { picked: false, value: null },
      smallStraight: { picked: false, value: null },
      largeStraight: { picked: false, value: null },
      chance: { picked: false, value: null },
      yahtzee: { picked: false, value: null },
      bonus: null,
      total: null,
    };
    this.timeLeft = 30;
  }
}
