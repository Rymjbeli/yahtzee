import {inject, Inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {GameState} from "../../interfaces/game-state";
import {Player} from "../../models/player";
import {Dice} from "../../models/dice";
import {BehaviorSubject, observable, Subject, tap} from "rxjs";
import {DiceService} from "./dice.service";
import {RulesService} from "./rules.service";
import {AnimationsService} from "../animation/animations.service";
import {generateRandomDicePositions} from "../../helpers/generate-random-dice-positions";
import {isPlatformBrowser} from "@angular/common";
import {CONSTANTS} from "../../../../config/const.config";
import {ScoreCard} from "../../interfaces/score-card";
import {Position} from "../../interfaces/position";
import {HubService} from "../Hub/hub.service";
import {ActivatedRoute} from "@angular/router";
import {coerceStringArray} from "@angular/cdk/coercion";
import {NUMPAD_EIGHT} from "@angular/cdk/keycodes";
import {BaseGameService} from "./base-game.service";

@Injectable({
  providedIn: 'root'
})
export class OnlineGameService extends BaseGameService {
  private hubService = inject(HubService);
  private activatedRoute = inject(ActivatedRoute);
  private globalPlayerId: number = -1;
  private roomCode: string = "";

  constructor() {
    super();
    console.log("OnlineGameService")
    this.rollCounter = -1;
    this.updateGameState({
      dicePositions: generateRandomDicePositions(),
    });

    if (isPlatformBrowser(this.platformId)) {
      const storedState = localStorage.getItem(CONSTANTS.IS_TIMER_ENABLED);
      if (storedState) {
        this.isTimerEnabled = storedState === 'true';
      }

      this.activatedRoute.queryParamMap.subscribe((params) => {
        if(params.has('room')){
          this.roomCode = params.get('room')!;
          this.hubService.checkRoom(params.get('room')!).subscribe(
            (res)=>{
              console.log(res);
              if(res.split(':')[1]==="True"){
                this.hubService.JoinRoom(params.get('room')!).subscribe(
                  (res)=>{
                    console.log(res);
                    this.globalPlayerId = 1;
                    this.initRoom();
                  }
                );
              }else{
                //We create
                this.hubService.createRoom(params.get('room')!).subscribe(
                  (res)=>{
                    console.log(res);
                    this.globalPlayerId = 0;
                    this.initRoom();
                  }
                );
              }
            }
          );
        }
      });
    }

    this.rollCounter = -1;
  }

  /**
   *
   * Initializes backend callbacks for the given room.
   * Player will always be considered as "PLAYER 1" locally.
   * */
  initRoom(){
    this.hubService.onRoomFilled().subscribe(()=>{

    });
    this.hubService.onGameEnd().subscribe(()=>{
      this.gameEnded.next("");
      alert('Sakrna el hanout')
    })
    this.hubService.onStartingPlayerRoll().subscribe(
      (res)=>{
        const vals = res.split(':').map(e=>Number(e));
        if(vals[0]==this.globalPlayerId){
          this.total1.set(vals[1]);
        }else {
          this.total2.set(vals[1]);
        }
      }
    );
    this.hubService.onSetDice().subscribe(
      (res)=>{
        console.log(res);
        const gameState = this.getGameStateValue();
        const diceVals = String(res.split(':')[1]).split(',').map(e=>Number(e));
        const dice = gameState.dice;
        const id = Number(res.split(':')[0]);
        if(id < 2){
          if(id == this.globalPlayerId){
            for(let i = 0; i < 5;i++){
              dice[i].value = diceVals[i];
              dice[i].isHeld = false;
            }
            this.updateGameState({
              dice: dice,
              dicePositions: generateRandomDicePositions(),
            });
          }
        }else{
          for(let i = 0; i < 5;i++){
            dice[i].value = diceVals[i];
          }
          this.updateGameState({
            dice: dice,
            dicePositions: generateRandomDicePositions(),
          });
          const currentPlayer = this.getGameStateValue().currentPlayerIndex;
          this.calculateScoreCard(currentPlayer);
        }
      }
    );
    this.hubService.onGameStart().subscribe(
      (res)=>{
        const game = this.getGameStateValue();
        let currentPlayer = game.currentPlayerIndex;
        setTimeout(() => {
          currentPlayer = Number(res) ^ this.globalPlayerId;
          this.rollCounter=3;
          this.beforeGame.set(false);
          const gameState = this.getGameStateValue();
          gameState.dice.map(die => {
            die.isHeld = true;
            return die;
          });
          this.updateGameState({ currentPlayerIndex: currentPlayer });
          if(currentPlayer == 1){
            this.updateGameState({rollsLeft: 0});
            console.log("This player shall play later lol");
          }
        }, 3000);
      }
    )
    this.hubService.onHideDice().subscribe((res)=>{
      console.log(res)
      const gameState = this.getGameStateValue();
      const diceHeldVals = res.split(',');
      for(let i = 0; i < 5;i++){
        gameState.dice[i].isHeld = diceHeldVals[i]!='1';
      }
      this.gameStateSubject.next(gameState);
    });
    this.hubService.onScoreChosen().subscribe((res)=>{
      console.log(res);
      const score = res.split(':')[1];
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
          rollsLeft: (gameState.currentPlayerIndex + 1) % gameState.players.length == 0 ? 3: 0,
          dice: dice,
          totalTurn: gameState.totalTurn + 1,
        });
        this.startTimerNextTurn = false;
        this.calculateTotalScore(index);
      }
    })
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
  toggleHoldDice(diceIndex: number) {
    if (this.getGameStateValue().rollsLeft === 3 || this.getGameStateValue().currentPlayerIndex==1) return;
    console.log("Will hide dice")
    const gameState = this.gameStateSubject.getValue();
    gameState.dice[diceIndex].isHeld = !gameState.dice[diceIndex].isHeld;
    this.gameStateSubject.next(gameState);
    let dice = ""
    for(let i = 0; i < 5 ; i++){
      dice += gameState.dice[i].isHeld ? "1" : "0"
      console.log(i, gameState.dice[i].isHeld)
    }
    console.log(dice);
    this.hubService.hideDice(this.roomCode, dice);
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
  checkNewYahtzee(scoreCard: ScoreCard, dice: Dice[]) {
    const gotYahtzee = this.rulesService.calculateYahtzee(dice) > 0;
    const yahtzeePick = scoreCard.yahtzee?.picked;
    const yahtzeeValue = scoreCard.yahtzee?.value;

    return gotYahtzee && yahtzeePick && yahtzeeValue && yahtzeeValue > 0;
  }

  /**
   * Main roll function: Rolls the dice and updates the game state with the new values.
   */
  rollDice(): void {
    const game = this.getGameStateValue();
    let currentPlayer = game.currentPlayerIndex;
    if (this.rollCounter <2) {
      this.hubService.StartingPlayerRoll(this.roomCode);
      console.log(this.roomCode);
      this.beforeGame.set(true)
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
    let rollsLeft = this.getGameStateValue().rollsLeft;
    if (this.isTimerEnabled && rollsLeft === 3) {
      this.startTimer();
    }
    this.updateGameState({
      //dice: this.diceService.rollAllDice(this.getGameStateValue().dice, rollsLeft),
      //dicePositions: generateRandomDicePositions(),
      rollsLeft: Math.max(0, rollsLeft - 1),
    });
    this.hubService.rollDice(this.roomCode);
  }
  /**
   * Get the positions of the dice.
   */
  getDicePositions(index: number): Position {
    const positions = this.getGameStateValue().dicePositions;
    if (positions && positions[index]) {
      return positions[index];
    }
    return { top: '50%', left: '50%', transform: 'rotate(0deg)' };
  }

  /**
   * Resets the game state to the initial state.
   */
  resetGame(): void {
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

  /**
   * Updates the game state with the chosen score.
   * @param score
   */
  scoreChosen(score: string): void {
    console.log(score);
    this.hubService.chooseScore(this.roomCode, score);
  }

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

  /**
   * Get the timer state
   */
  getTimerState(): boolean {
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

}
