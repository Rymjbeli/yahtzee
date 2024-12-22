import { Injectable } from '@angular/core';
import {GameState} from "../interfaces/game-state";
import {Player} from "../models/player";
import {Dice} from "../models/dice";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private initialGameState: GameState = {
    players: [new Player('Player 1'), new Player('Player 2')],
    currentPlayerIndex: 0,
    dice: Array.from({ length: 5 }, () => new Dice()),
    rollsLeft: 3,
  }

  private gameStateSubject = new BehaviorSubject<GameState>(this.initialGameState);
  gameState$ = this.gameStateSubject.asObservable();

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
}
