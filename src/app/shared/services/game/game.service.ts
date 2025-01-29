import {inject, Injectable} from '@angular/core';
import { generateRandomDicePositions } from "../../helpers/generate-random-dice-positions";
import { isPlatformBrowser } from '@angular/common';
import { CONSTANTS } from '../../../../config/const.config';
import {BaseGameService} from "./base-game.service";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class GameService extends BaseGameService {
  private translate = inject(TranslateService);
  private playerStartingMessage : string = "";
  constructor() {
    super();

    this.updateGameState({
      dicePositions: generateRandomDicePositions(),
    });

    this.rollCounter = 0;

    this.translate.stream('game_board.starting').subscribe((res) => {
      this.playerStartingMessage = res;
    });
  }

  toggleHoldDice(diceIndex: number) {
    if (this.getGameStateValue().rollsLeft === 3) return;
    const gameState = this.gameStateSubject.getValue();
    gameState.dice[diceIndex].isHeld = !gameState.dice[diceIndex].isHeld;
    this.gameStateSubject.next(gameState);
  }

  rollDice(): void {
    const game = this.getGameStateValue();
    let currentPlayer = game.currentPlayerIndex;

    if (this.rollCounter === 0) {

      this.updateTotal1(game.currentPlayerIndex)
      this.rollCounter++;

    } else if (this.rollCounter === 1) {

      this.updateTotal2(game.currentPlayerIndex);
      currentPlayer = this.total1() > this.total2() ? 0 : 1;
      const playerName = game.players[currentPlayer].name;
      this.startMessage = `${ playerName } ${ this.playerStartingMessage }`;

      this.beforeGame.set(true)

      setTimeout(() => {
        this.rollCounter++;
        this.beforeGame.set(false);

        const gameState = this.getGameStateValue();
        gameState.dice.map(die => {
          die.isHeld = true;
          return die;
        });
      }, 3000);

      this.updateGameState({ currentPlayerIndex: currentPlayer });

    } else {

      this.rollDiceInsideGame();

      const yahtzee = this.rulesService.calculateYahtzee(game.dice) > 0;
      const picked = game.players[currentPlayer].scoreCard.yahtzee.picked;

      const nbrOfYahtzee = this.getNbrOfYahtzee();
      if (yahtzee && !picked)
        this.animationService.displayYahtzee(false, nbrOfYahtzee);
      if (yahtzee && picked)
        this.animationService.displayYahtzee(true, nbrOfYahtzee);
    }
  }

  rollDiceInsideGame(): void {
    const rollsLeft = this.getGameStateValue().rollsLeft;
    if (this.isTimerEnabled && rollsLeft === 3) {
      this.startTimer();
    }
    this.updateGameState({
      dice: this.diceService.rollAllDice(this.getGameStateValue().dice, rollsLeft),
      dicePositions: generateRandomDicePositions(),
      rollsLeft: Math.max(0, rollsLeft - 1),
    });

    const currentPlayer = this.getGameStateValue().currentPlayerIndex;
    this.calculateScoreCard(currentPlayer);
  }

  scoreChosen(score: string): void {
    const gameState = this.getGameStateValue();
    const index = gameState.currentPlayerIndex;
    const currentPlayer = gameState.players[index];
    const scoreCard = currentPlayer.scoreCard;
    const scoreCardItem = scoreCard[score];

    if (scoreCardItem && !scoreCardItem.picked) {
      scoreCardItem.picked = true;

      for (const key in scoreCard) {
        if (scoreCard.hasOwnProperty(key) && key !== score) {
          const item = scoreCard[key];
          if (item && typeof item === 'object' && !item.picked) {
            item.value = null;
          }
        }
      }

      const dice = gameState.dice.map(die => {
        die.isHeld = true;
        return die;
      });

      if (score === 'yahtzee' && scoreCard.nbrOfYahtzee < 5) {
        scoreCard.nbrOfYahtzee++;
      }

      // stop and reset the timer
      if (this.isTimerEnabled && this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      currentPlayer.timeLeft = 30;

      this.updateGameState({
        players: gameState.players,
        currentPlayerIndex: (gameState.currentPlayerIndex + 1) % gameState.players.length,
        rollsLeft: 3,
        dice: dice,
        totalTurn: gameState.totalTurn + 1,
      });
      this.startTimerNextTurn = false;
      this.calculateTotalScore(index);
    }
  }

  startTimer(): void {
    const gameState = this.getGameStateValue();
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.timeLeft = 30;

    this.timerId = setInterval(() => {
      currentPlayer.timeLeft -= 1;
      if (currentPlayer.timeLeft <= 0) {
        clearInterval(this.timerId);
        currentPlayer.timeLeft = 30;
        // if the player runs out of time, choose the minimum score to keep
        this.scoreChosen(this.minimumScoreToKeep());
      }
      this.updateGameState({
        players: gameState.players.map((p, i) => {
          if (i === gameState.currentPlayerIndex) {
            return { ...p, timeLeft: currentPlayer.timeLeft };
          }
          return p;
        })
      });
    }, 1000);
  }

  toggleTimer(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isTimerEnabled) {
        clearInterval(this.timerId);
        this.timerId = null;
        this.isTimerEnabled = false;
      } else {
        if (this.getGameStateValue().rollsLeft !== 3) {
          this.startTimerNextTurn = true;

        } else {
          this.startTimerNextTurn = false;
        }
        this.isTimerEnabled = true;
      }
      localStorage.setItem(CONSTANTS.IS_TIMER_ENABLED, this.isTimerEnabled.toString());
      return this.isTimerEnabled;
    }
    return false;
  }

  updateTotal1(playerIndex: number): void {
    const newTotal1 = this.rollStart(playerIndex);
    this.total1.set(newTotal1);
  }

  updateTotal2(playerIndex: number): void {
    const newTotal2 = this.rollStart(playerIndex);
    this.total2.set(newTotal2);
  }
}
