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
import {Position} from "../../interfaces/position";
import {generateRandomDicePositions} from "../../helpers/generate-random-dice-positions";

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
  canPlayAgain = signal(true);
  gameEnded =  new Subject();
  protected constructor() { }

  abstract rollStart(playerIndex: number): number
  abstract updatePlayerName(playerIndex: number, name: string): void
  abstract getGameStateValue(): GameState
  abstract toggleHoldDice(diceIndex: number): void
  abstract updateGameState(newState: Partial<GameState>): void
  abstract calculateScoreCard(playerIndex: number): void
  abstract checkYahtzeeAndYahtzeeBonus(scoreCard: ScoreCard, dice: Dice[]): void
  abstract checkNewYahtzee(scoreCard: ScoreCard, dice: Dice[]): number | boolean | null
  abstract rollDice(): void
  protected abstract rollDiceInsideGame(): void
  abstract getDicePositions(index: number): Position
  public resetGame(): void{
    const currentGameState = this.getGameStateValue();
    const playerNames = currentGameState.players.map(player => player.name);
    const dicePositions = generateRandomDicePositions();
    this.rollCounter = 0;
    this.total1.set(0);
    this.total2.set(0);
    const newDice = Array.from({ length: 5 }, () => new Dice());
    this.startTimerNextTurn = false;

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
  abstract scoreChosen(score: string): void
  abstract isBonusEligible(playerIndex: number): boolean
  abstract calculateTotalScore(playerIndex: number): void
  abstract gameIsOver(): boolean
  abstract startTimer(): void
  abstract minimumScoreToKeep(): string
  abstract toggleTimer(): boolean
  abstract getTimerState(): boolean
  abstract getNbrOfYahtzee(): number
  abstract getYahtzeeScore(): number
  public initGame() : void {
    //do nothing
  }
  public destroyGame(): void{
    //do nothing
  }
}
