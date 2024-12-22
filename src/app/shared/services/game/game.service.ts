import { Injectable } from '@angular/core';
import {GameState} from "../../interfaces/game-state";
import {Player} from "../../models/player";
import {Dice} from "../../models/dice";
import {BehaviorSubject} from "rxjs";
import {Position} from "../../interfaces/position";
import {generateRandomDicePositions} from "../../helpers/generate-random-dice-positions";
import {DiceService} from "./dice.service";

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

  constructor(private diceService: DiceService) {
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
    const gameState = this.gameStateSubject.getValue();
    gameState.players[playerIndex].name = name;
    this.gameStateSubject.next(gameState);
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
      ...this.gameStateSubject.value,
      ...newState,
    });
  }

  /**
   * Main roll function: Rolls the dice and updates the game state with the new values.
   */
  rollDice(): void {
    const rollsLeft = this.gameStateSubject.value.rollsLeft;

    this.updateGameState({
      dice: this.diceService.rollAllDice(this.gameStateSubject.value.dice,rollsLeft),
      dicePositions: generateRandomDicePositions(),
      rollsLeft: Math.max(0, rollsLeft - 1),
    });
  }


  /**
   * Resets the game state to the initial state.
   */
  getDicePositions(): Position[] {
    return this.gameStateSubject.value.dicePositions;
  }
}
