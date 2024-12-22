export interface ScoreCardItem {
  picked: boolean;
  value: number | null;
}

export interface ScoreCard {
  aces: ScoreCardItem;
  twos: ScoreCardItem;
  threes: ScoreCardItem;
  fours: ScoreCardItem;
  fives: ScoreCardItem;
  sixes: ScoreCardItem;
  threeOfAKind: ScoreCardItem;
  fourOfAKind: ScoreCardItem;
  fullHouse: ScoreCardItem;
  smallStraight: ScoreCardItem;
  largeStraight: ScoreCardItem;
  chance: ScoreCardItem;
  yahtzee: ScoreCardItem;
  bonus: null;
  total: null;
  [key: string]: ScoreCardItem | null;
}
