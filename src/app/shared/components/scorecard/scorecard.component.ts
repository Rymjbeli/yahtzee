import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models/player';
import {RulesService} from "../../services/game/rules.service";
import {Section} from "../../interfaces/section.interface";
import {BaseGameService} from "../../services/game/base-game.service";
import {GameManagerService} from "../../services/game/game-manager.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-scorecard',
  standalone: true,
  imports: [FormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss'
})
export class ScorecardComponent {
  @Input() player: Player | undefined;
  @Input() playerIndex: number | undefined;
  @Input() isActivePlayer: boolean = false;
  @Output() inputClicked = new EventEmitter<string>();
  nbrOfYahtzee = 'nbrOfYahtzee';

  rulesService = inject(RulesService);
  gameService!: BaseGameService;
  gameManagerService = inject(GameManagerService);

  upperSection: Section[] = [
    { variable: 'aces', name: 'Aces', icon: 'assets/icons/dices/die-1.svg', disabled: true },
    { variable: 'twos', name: 'Twos', icon: 'assets/icons/dices/die-2.svg', disabled: true },
    { variable: 'threes', name: 'Threes', icon: 'assets/icons/dices/die-3.svg', disabled: true },
    { variable: 'fours', name: 'Fours', icon: 'assets/icons/dices/die-4.svg', disabled: true },
    { variable: 'fives', name: 'Fives', icon: 'assets/icons/dices/die-5.svg', disabled: true },
    { variable: 'sixes', name: 'Sixes', icon: 'assets/icons/dices/die-6.svg', disabled: true }
  ];
  lowerSection: Section[] = [
    { variable: 'threeOfAKind', name: 'Three of a kind', disabled: true },
    { variable: 'fourOfAKind', name: 'Four of a kind', disabled: true },
    { variable: 'fullHouse', name: 'Full house', disabled: true },
    { variable: 'smallStraight', name: 'Small straight', disabled: true },
    { variable: 'largeStraight', name: 'Large straight', disabled: true },
    { variable: 'chance', name: 'Chance', disabled: true },
    { variable: 'yahtzee', name: 'YAHTZEE', disabled: true }
  ];

  constructor() {
    // Subscribe to the current game service
    this.gameManagerService.currentGameService
      .pipe(takeUntilDestroyed())
      .subscribe((gameService) => {
      this.gameService = gameService!;
    });
  }
  checkScore(item: Section): boolean {
    if (!this.isActivePlayer) {
      item.disabled = true;
      return item.disabled;
    }

    const gameState = this.gameService.getGameStateValue();
    const scoreCard = this.player?.scoreCard!;

    const nbrOfYahtzee = scoreCard[this.nbrOfYahtzee].value || 0;
    const newYahtzee = this.gameService.checkNewYahtzee(scoreCard, gameState.dice);
    const yahtzeeBonus = newYahtzee && nbrOfYahtzee < 4;

    if(yahtzeeBonus) {
      const upperSectionKey = this.rulesService.getAppropriateUpperSectionKeyForYahtzee(gameState.dice);
      const scoreCardUpperSection = scoreCard[upperSectionKey];

      if(!scoreCardUpperSection.picked && item.variable !== upperSectionKey) {
        item.disabled = true;
        return item.disabled;
      }
    }

    const scoreCardItem = scoreCard[item.variable];
    const isPicked = scoreCardItem?.picked;
    const value = scoreCardItem?.value;
    if (this.areAllScoresZero()) {
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

  onInputClick(section: string) {
    this.inputClicked.emit(section);
  }
}
