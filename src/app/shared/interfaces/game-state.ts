import {Player} from "../models/player";
import {Dice} from "../models/dice";

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  dice: Dice[];
  rollsLeft: number;
}
