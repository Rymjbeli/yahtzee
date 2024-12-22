import {Player} from "../models/player";
import {Dice} from "../models/dice";
import {Position} from "./position";

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  dice: Dice[];
  dicePositions: Position[]; // Dice Positions declared in the game state to check easily that they hold different values
  rollsLeft: number;
}
