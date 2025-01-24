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

@Injectable({
  providedIn: 'root'
})
export abstract class BaseGameService {
  // Inject the services
  localStorageService = inject(LocalStorageService);
  animationService = inject(AnimationsService);
  rulesService = inject(RulesService);
  diceService = inject(DiceService);

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
  abstract resetGame(): void
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
}
