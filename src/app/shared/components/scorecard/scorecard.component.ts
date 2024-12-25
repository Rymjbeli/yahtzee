import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scorecard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss'
})
export class ScorecardComponent {
  @Input() playerName: string = 'Player 1';
  @Input() isActivePlayer: boolean = false;
  @Output() bonusScoreChange = new EventEmitter<number>();
  @Output() totalScoreChange = new EventEmitter<number>();
  @Output() upperSectionScoreChange = new EventEmitter<{ name: string, score: number, disabled: boolean }>();
  @Output() lowerSectionScoreChange = new EventEmitter<{ name: string, score: number, disabled: boolean }>();

  totalScore: number = 0;
  bonusScore: number = 0;
  totalUpperSectionScore: number = 0;

  upperSection = [
    { name: 'Aces', icon: 'assets/icons/dices/die-1.svg', score: 0, disabled: false },
    { name: 'Twos', icon: 'assets/icons/dices/die-2.svg', score: 0, disabled: false },
    { name: 'Threes', icon: 'assets/icons/dices/die-3.svg', score: 0, disabled: false },
    { name: 'Fours', icon: 'assets/icons/dices/die-4.svg', score: 0, disabled: false },
    { name: 'Fives', icon: 'assets/icons/dices/die-5.svg', score: 0, disabled: false },
    { name: 'Sixes', icon: 'assets/icons/dices/die-6.svg', score: 0, disabled: false }
  ];
  lowerSection = [
    { name: 'Three of a kind', score: 0, disabled: false },
    { name: 'Four of a kind', score: 0, disabled: false },
    { name: 'Full house', score: 0, disabled: false },
    { name: 'Small straight', score: 0, disabled: false },
    { name: 'Large straight', score: 0, disabled: false },
    { name: 'Chance', score: 0, disabled: false },
    { name: 'YAHTZEE', score: 0, disabled: false }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isActivePlayer'] && !changes['isActivePlayer'].currentValue) {
      this.resetDisabledProperties();
    }
  }

  resetDisabledProperties() {
    this.upperSection.forEach(item => item.disabled = false);
    this.lowerSection.forEach(item => item.disabled = false);
  }

  calculateUpperSectionScore() {
    this.totalUpperSectionScore = this.upperSection.reduce((acc, item) => acc + item.score, 0);
    this.checkAndApplyBonus();
  }

  checkAndApplyBonus() {
    if (this.totalUpperSectionScore >= 63) {
      this.bonusScore = 35;
    } else {
      this.bonusScore = 0;
    }
    this.bonusScoreChange.emit(this.bonusScore);
  }

  calculateTotalScore() {
    let totalLowerSectionScore = this.lowerSection.reduce((acc, item) => acc + item.score, 0);
    this.totalScore = this.totalUpperSectionScore + totalLowerSectionScore + this.bonusScore;
    this.totalScoreChange.emit(this.totalScore);
  }

  onScoreChange(newScore: number, item?: { name: string, score: number, disabled: boolean } | { name: string, icon: string, score: number, disabled: boolean }) {
    if (item) {
      item.score = newScore;
      if (this.upperSection.includes(item as { name: string, icon: string, score: number, disabled: boolean })) {
        this.upperSectionScoreChange.emit({ name: item.name, score: newScore, disabled: item.disabled });
      } else if (this.lowerSection.includes(item as { name: string, score: number, disabled: boolean })) {
        this.lowerSectionScoreChange.emit({ name: item.name, score: newScore, disabled: item.disabled });
      }
    }
    this.calculateUpperSectionScore();
    this.calculateTotalScore();
  }

}
