import { Injectable } from '@angular/core';
import {GameState} from "../../interfaces/game-state";
import {Player} from "../../models/player";
import {Dice} from "../../models/dice";
import {BehaviorSubject} from "rxjs";
import {Position} from "../../interfaces/position";
import {generateRandomDicePositions} from "../../helpers/generate-random-dice-positions";
import {DiceService} from "./dice.service";
import {RulesService} from "./rules.service";
import {ScoreCard} from "../../interfaces/score-card";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private initialGameState: GameState = {
    players: [new Player('Player 1'), new Player('Player 2')],
    currentPlayerIndex: 0,
    dice: Array.from({ length: 5 }, () => new Dice()),
    dicePositions: [],
    rollsLeft: 3,
  }

  private gameStateSubject = new BehaviorSubject<GameState>(this.initialGameState);
  gameState$ = this.gameStateSubject.asObservable();

  constructor(
    private diceService: DiceService,
    private rulesService: RulesService
  ) {
    this.updateGameState({
      dicePositions: generateRandomDicePositions(),
    });
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
  toggleHoldDice(diceIndex: number) {
    const gameState = this.gameStateSubject.getValue();
    gameState.dice[diceIndex].isHeld = !gameState.dice[diceIndex].isHeld;
    this.gameStateSubject.next(gameState);
  }

  /**
   * Updates the game state with the new state.
   * @param newState
   */
  updateGameState(newState: Partial<GameState>) {
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

    const newScoreCard: ScoreCard = currentPlayer?.scoreCard || {};

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

    // Update the player's scorecard
    currentPlayer.scoreCard = newScoreCard;

    // Update the game state
    this.updateGameState({ players: gameState.players });
  }


  /**
   * Main roll function: Rolls the dice and updates the game state with the new values.
   */
  rollDice(): void {
    const rollsLeft = this.getGameStateValue().rollsLeft;

    this.updateGameState({
      dice: this.diceService.rollAllDice(this.getGameStateValue().dice,rollsLeft),
      dicePositions: generateRandomDicePositions(),
      rollsLeft: Math.max(0, rollsLeft - 1),
    });
  }


  /**
   * Resets the game state to the initial state.
   */
  getDicePositions(): Position[] {
    return this.getGameStateValue().dicePositions;
  }

  /**
   * Resets the game state to the initial state.
   */
  resetGame(): void {
    this.updateGameState(this.initialGameState);
  }
}
