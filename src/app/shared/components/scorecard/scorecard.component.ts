import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models/player';


interface Section {
  variable: string,
  name: string,
  icon?: string,
  score: number | null,
  disabled: boolean,
}

@Component({
  selector: 'app-scorecard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss'
})
export class ScorecardComponent {
  @Input() player: Player | undefined;
  @Input() isActivePlayer: boolean = false;

  upperSection: Section[] = [
    { variable: 'aces', name: 'Aces', icon: 'assets/icons/dices/die-1.svg', score: null, disabled: true },
    { variable: 'twos', name: 'Twos', icon: 'assets/icons/dices/die-2.svg', score: null, disabled: true },
    { variable: 'threes', name: 'Threes', icon: 'assets/icons/dices/die-3.svg', score: null, disabled: true },
    { variable: 'fours', name: 'Fours', icon: 'assets/icons/dices/die-4.svg', score: null, disabled: true },
    { variable: 'fives', name: 'Fives', icon: 'assets/icons/dices/die-5.svg', score: null, disabled: true },
    { variable: 'sixes', name: 'Sixes', icon: 'assets/icons/dices/die-6.svg', score: null, disabled: true }
  ];
  lowerSection: Section[] = [
    { variable: 'threeOfAKind', name: 'Three of a kind', score: null, disabled: true },
    { variable: 'fourOfAKind', name: 'Four of a kind', score: null, disabled: true },
    { variable: 'fullHouse', name: 'Full house', score: null, disabled: true },
    { variable: 'smallStraight', name: 'Small straight', score: null, disabled: true },
    { variable: 'largeStraight', name: 'Large straight', score: null, disabled: true },
    { variable: 'chance', name: 'Chance', score: null, disabled: true },
    { variable: 'yahtzee', name: 'YAHTZEE', score: null, disabled: true }
  ];

  ngOnInit() {
    this.initializeScores();
  }

  initializeScores() {
    if (this.player) {
      this.upperSection.forEach(item => {
        item.score = this.player?.scoreCard[item.variable]?.value ?? null;
      });
      this.lowerSection.forEach(item => {
        item.score = this.player?.scoreCard[item.variable]?.value ?? null;
      });
    }
  }

  checkScore(item: Section): boolean {
    if (!this.isActivePlayer) {
      item.disabled = true;
      return item.disabled;
    }

    const scoreCard = this.player?.scoreCard[item.variable];
    const isPicked = scoreCard?.picked;
    const value = scoreCard?.value;

    if (this.areAllScoresZero()) {
      console.log('hi');
      item.disabled = !!isPicked;
      return item.disabled;
    }

    item.disabled = isPicked || (value === 0 || value === null);
    return item.disabled;
  }

  areAllScoresZero(): boolean {
    const allSection = [...this.upperSection, ...this.lowerSection];
    return allSection.every(section =>
      this.player?.scoreCard[section.variable]?.picked ||
      this.player?.scoreCard[section.variable]?.value === 0
    );
  }
}
