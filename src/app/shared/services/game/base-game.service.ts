import {inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {GameState} from "../../interfaces/game-state";
import {Player} from "../../models/player";
import {Dice} from "../../models/dice";
import {BehaviorSubject, Subject} from "rxjs";
import {LocalStorageService} from "../shared/local-storage.service";
import {DiceService} from "./dice.service";
import {RulesService} from "./rules.service";
import {AnimationsService} from "../animation/animations.service";
import {ScoreCard} from "../../interfaces/score-card";
import {generateRandomDicePositions} from "../../helpers/generate-random-dice-positions";
import {isPlatformBrowser} from "@angular/common";
import {CONSTANTS} from "../../../../config/const.config";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseGameService {
  // Inject the services
  protected localStorageService = inject(LocalStorageService);
  protected animationService = inject(AnimationsService);
  protected rulesService = inject(RulesService);
  protected diceService = inject(DiceService);

  // Inject the platformId
  protected platformId = inject(PLATFORM_ID);

  // Define the properties
  playerOneName =
    this.localStorageService.getData('playerName', this.platformId) ||
    'Player 1';
  playerTwoName =
    this.localStorageService.getData('playerTwoName', this.platformId) ||
    'Player 2';
  protected initialGameState: GameState = {
    players: [new Player(this.playerOneName), new Player(this.playerTwoName)],
    currentPlayerIndex: 0,
    dice: Array.from({ length: 5 }, () => new Dice()),
    dicePositions: [],
    rollsLeft: 3,
    totalTurn: 0,
  }

  protected timerId: any;
  public isTimerEnabled: boolean = false;
  public startTimerNextTurn: boolean = false;

  protected gameStateSubject = new BehaviorSubject<GameState>(this.initialGameState);
  gameState$ = this.gameStateSubject.asObservable();

  rollCounter = 0;
  beforeGame = signal(false);
  total1 = signal(0);
  total2 = signal(0);
  startMessage: string = '';

  canPlayAgain = signal(true);
  gameEnded =  new Subject();
  protected rollTimeoutId: any = null;

  protected constructor() {
    this.getTimerState();
  }

  /**
   * know who will start the game
   * @param playerIndex
   */
  rollStart(playerIndex: number): number {
    const gameState = this.getGameStateValue();
    const dice = this.diceService.rollAllDice(gameState.dice, 3);
    const total = this.diceService.calculateTotal(dice);
    this.updateGameState({
      currentPlayerIndex: playerIndex === 0 ? 1 : 0,
      dice: dice,
      dicePositions: generateRandomDicePositions(),
    });

    return total;
  }
  /**
   * Updates the name of a player at the specified index.
   *
   * @param playerIndex - The index of the player whose name is to be updated.
   * @param name - The new name for the player.
   */
  updatePlayerName(playerIndex: number, name: string) {
    const gameState = this.getGameStateValue();
    gameState.players[playerIndex].name = name;
    this.gameStateSubject.next(gameState);
  }
  /**
   * Get Game State value
   */
  getGameStateValue(): GameState {
    return this.gameStateSubject.value;
  }
  /**
   * Toggles the hold status of a die at the specified index.
   * @param diceIndex
   */
  abstract toggleHoldDice(diceIndex: number): void
  /**
   * Updates the game state with the new state.
   * @param newState
   */
  updateGameState(newState: Partial<GameState>) {
    if (newState.players) {
      newState.players = newState.players.map(player => ({
        ...player // Create a new reference for each player
      }));
    }

    this.gameStateSubject.next({
      ...this.getGameStateValue(),
      ...newState,
    });
  }
  /**
   * Calculates the scorecard for the player at the specified index.
   * @param playerIndex
   */
  calculateScoreCard(playerIndex: number): void {
    const gameState = this.gameStateSubject.getValue();
    const currentPlayer = gameState.players[playerIndex];
    const dice = gameState.dice;

    let newScoreCard: ScoreCard = currentPlayer?.scoreCard || {};

    // Calculate scores for each rule
    const rules = [
      { key: 'aces', calculate: () => this.rulesService.calculateUpperSection(dice, 1) },
      { key: 'twos', calculate: () => this.rulesService.calculateUpperSection(dice, 2) },
      { key: 'threes', calculate: () => this.rulesService.calculateUpperSection(dice, 3) },
      { key: 'fours', calculate: () => this.rulesService.calculateUpperSection(dice, 4) },
      { key: 'fives', calculate: () => this.rulesService.calculateUpperSection(dice, 5) },
      { key: 'sixes', calculate: () => this.rulesService.calculateUpperSection(dice, 6) },
      { key: 'threeOfAKind', calculate: () => this.rulesService.calculateThreeOfAKind(dice) },
      { key: 'fourOfAKind', calculate: () => this.rulesService.calculateFourOfAKind(dice) },
      { key: 'fullHouse', calculate: () => this.rulesService.calculateFullHouse(dice) },
      { key: 'smallStraight', calculate: () => this.rulesService.calculateSmallStraight(dice) },
      { key: 'largeStraight', calculate: () => this.rulesService.calculateLargeStraight(dice) },
      { key: 'chance', calculate: () => this.rulesService.calculateChance(dice) },
      { key: 'yahtzee', calculate: () => this.rulesService.calculateYahtzee(dice) },
    ];


    // Iterate over each rule and calculate its value if not already picked
    rules.forEach(({ key, calculate }) => {
      const scoreCardItem = newScoreCard[key];
      if (scoreCardItem && !scoreCardItem?.picked) {
        scoreCardItem.value = calculate();
      }
    });

    this.checkYahtzeeAndYahtzeeBonus(newScoreCard, dice);

    // Update the player's scorecard
    currentPlayer.scoreCard = newScoreCard;

    // Update the game state
    this.updateGameState({ players: gameState.players });
  }

  /**
   * Check the yahtzee and yahtzee bonus(only in the second third and fourth yahtzee)
   * @param scoreCard
   * @param dice
   */
  checkYahtzeeAndYahtzeeBonus(scoreCard: ScoreCard, dice: Dice[]) {
    const yahtzeeNbr = scoreCard.nbrOfYahtzee;

    const incrementYahtzee = this.checkNewYahtzee(scoreCard, dice);
    const yahtzeeBonus = incrementYahtzee && yahtzeeNbr < 4;

    // Yahtzee bonus if the player has already picked yahtzee and this is the second or
    // more yahtzee but less than 4 times
    if (yahtzeeBonus) {
      this.rulesService.applyYahtzeeBonus(scoreCard, dice);
    }

    if (incrementYahtzee && yahtzeeNbr < 5) {
      scoreCard.nbrOfYahtzee++;
    }
  }

  /**
   * Check if the player has a new yahtzee and has already picked yahtzee
   * @param scoreCard
   * @param dice
   */
  checkNewYahtzee(scoreCard: ScoreCard, dice: Dice[]): number | boolean | null {
    const gotYahtzee = this.rulesService.calculateYahtzee(dice) > 0;
    const yahtzeePick = scoreCard.yahtzee?.picked;
    const yahtzeeValue = scoreCard.yahtzee?.value;

    return gotYahtzee && yahtzeePick && yahtzeeValue && yahtzeeValue > 0;
  }

  /**
   * Main roll function: Rolls the dice and updates the game state with the new values.
   */
  abstract rollDice(): void

  protected abstract rollDiceInsideGame(): void

  /**
   * Resets the game state to the initial state.
   */
  public resetGame(): void {
    this.clearPendingTimers();
    this.resetGameProperties();

    const currentGameState = this.getGameStateValue();
    const playerNames = currentGameState.players.map(player => player.name);
    const dicePositions = generateRandomDicePositions();
    const newDice = Array.from({ length: 5 }, () => new Dice());

    // Create a fresh game state while keeping the player names intact
    const freshGameState: GameState = {
      players: playerNames.map(name => new Player(name)), // Re-create players with their names
      currentPlayerIndex: 0,
      dice: newDice,
      dicePositions: dicePositions,
      rollsLeft: 3,
      totalTurn: 0,
    };

    // Update the game state
    this.gameStateSubject.next(freshGameState);
  }

  private resetGameProperties() {
    this.rollCounter = 0;
    this.total1.set(0);
    this.total2.set(0);
    this.beforeGame.set(false);
    this.startMessage = '';
  }

  private clearPendingTimers() {
    if (this.rollTimeoutId) {
      clearTimeout(this.rollTimeoutId);
      this.rollTimeoutId = null; // Ensure it doesn't get executed
    }

    this.startTimerNextTurn = false;
    clearInterval(this.timerId);
    this.timerId = null;
  }

  /**
   * Updates the game state with the chosen score.
   * @param score
   */
  abstract scoreChosen(score: string): void

  /**
   * Check if the player is eligible for the bonus
   */
  isBonusEligible(playerIndex: number): boolean {
    const gameState = this.getGameStateValue();
    const player = gameState.players[playerIndex];
    const scoreCard = player.scoreCard;

    const upperSectionScore = ['aces', 'twos', 'threes', 'fours', 'fives', 'sixes']
      .reduce((sum, key) => sum + (scoreCard[key]?.value || 0), 0);

    return upperSectionScore >= 63;
  }

  /**
   * Calculate the total score for the player at the specified index.
   * @param playerIndex
   */
  calculateTotalScore(playerIndex: number) {
    const gameState = this.getGameStateValue();
    const player = gameState.players[playerIndex];
    const scoreCard = player.scoreCard;

    const upperSectionScore = ['aces', 'twos', 'threes', 'fours', 'fives', 'sixes']
      .reduce((sum, key) => sum + (scoreCard[key]?.value || 0), 0);

    const lowerSectionScore = ['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'chance', 'yahtzee']
      .reduce((sum, key) => sum + (scoreCard[key]?.value || 0), 0);

    const bonus = this.isBonusEligible(playerIndex) ? 35 : 0;
    let total = upperSectionScore + lowerSectionScore + bonus;

    if (scoreCard?.nbrOfYahtzee > 1) {
      total += 100 * (scoreCard?.nbrOfYahtzee - 1);
    }
    this.updateGameState({
      players: gameState.players.map((p, i) => {
        if (i === playerIndex) {
          p.scoreCard.bonus = bonus;
          p.scoreCard.total = total;
        }
        return p;
      })
    });
    if(playerIndex==0){
      this.total1.set(total);
    }else {
      this.total2.set(total);
    }
  }

  /**
   * Check if the game is over
   */
  gameIsOver(): boolean {
    const gameState = this.getGameStateValue();
    return gameState.totalTurn >= 26;
  }

  /**
   * Start the timer
   */
  abstract startTimer(): void

  /**
   * Get the minimum score to keep
   */
  minimumScoreToKeep(): string {
    const gameState = this.getGameStateValue();
    const player = gameState.players[gameState.currentPlayerIndex];
    const scoreCard = player.scoreCard;

    let allZero = true;
    let minScore = Infinity;
    let minScoreKey = '';
    const unpickedKeys = [];

    for (const key in scoreCard) {
      if (scoreCard.hasOwnProperty(key)) {
        const item = scoreCard[key];
        if (item && typeof item === 'object' && !item.picked) {
          unpickedKeys.push(key);
          if (item.value !== 0) {
            allZero = false;
          }
          if (item.value < minScore && item.value !== 0) {
            minScore = item.value;
            minScoreKey = key;
          }
        }
      }
    }

    if (allZero) {
      const randomIndex = Math.floor(Math.random() * unpickedKeys.length);
      return unpickedKeys[randomIndex];
    }

    return minScoreKey;
  }

  /**
   * Toggles the timer on and off
   */
  abstract toggleTimer(): boolean
  getTimerState(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = localStorage.getItem(CONSTANTS.IS_TIMER_ENABLED);
      if (storedState) {
        this.isTimerEnabled = storedState === 'true';
      }
    }
    return this.isTimerEnabled;
  }

  /**
   * Get the current player nbr of yahtzee of the current player
   */
  getNbrOfYahtzee(): number {
    const gameState = this.getGameStateValue();
    return gameState.players[gameState.currentPlayerIndex].scoreCard.nbrOfYahtzee;
  }

  /**
   * Get yahtzee score
   */
  getYahtzeeScore(): number {
    const gameState = this.getGameStateValue();
    return this.rulesService.calculateYahtzee(gameState.dice);
  }
  public initGame() : void {
    //do nothing
  }
  public destroyGame(): void{
    //do nothing
  }
}
