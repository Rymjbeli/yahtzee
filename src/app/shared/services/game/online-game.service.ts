import {inject, Inject, Injectable, OnInit, PLATFORM_ID, signal} from '@angular/core';
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
import {ActivatedRoute, Router} from "@angular/router";
import {coerceStringArray} from "@angular/cdk/coercion";
import {NUMPAD_EIGHT} from "@angular/cdk/keycodes";
import {BaseGameService} from "./base-game.service";

@Injectable({
  providedIn: 'root'
})
export class OnlineGameService extends BaseGameService{
  private hubService = inject(HubService);
  private router = inject(Router);
  private globalPlayerId: number = -1;
  private roomCode: string = "";

  constructor() {
    super();
    this.innitCallbacks();
  }


  /**
   *
   * Initializes backend callbacks for the given room.
   * Player will always be considered as "PLAYER 1" locally.
   * */
  public innitCallbacks(){
    this.hubService.onGameEnd().subscribe(()=>{
      this.gameEnded.next("");
    })
    this.hubService.onRoomClosed().subscribe(()=>{
      this.canPlayAgain.set(false);
    });
    this.hubService.onGameReset().subscribe(()=>{
      super.resetGame();
      this.rollCounter = -1;
    });
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

        const playerName = game.players[Number(res) ^ this.globalPlayerId].name;
        this.startMessage = `${playerName} will start`;

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
  public override initGame(){
    if(!this.hubService.IsInRoom){
      this.router.navigate(['/']);
    }
    this.rollCounter = -1;
    this.updateGameState({
      dicePositions: generateRandomDicePositions(),
    });
    this.roomCode = this.localStorageService.getData("roomCode", this.platformId);
    this.globalPlayerId = Number(this.localStorageService.getData("GlobalId", this.platformId));
  }

  public override destroyGame() {
    this.hubService.quitRoom(this.roomCode);
    super.resetGame();
    this.rollCounter = -1;
  }

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


  // TODO : FIX ROOMCODE BECOMING EMPTY OUT OF  A SUDDEN
  override resetGame(): void {
    this.roomCode = this.localStorageService.getData("roomCode", this.platformId);
    this.hubService.requestPlayAgain(this.roomCode);
  }

  scoreChosen(score: string): void {
    console.log(score);
    this.hubService.chooseScore(this.roomCode, score);
  }

  startTimer(): void {
    // do nothing
  }

  toggleTimer(): boolean {
    return false;
  }
}
