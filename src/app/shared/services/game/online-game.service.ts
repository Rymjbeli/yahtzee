import {inject, Injectable} from '@angular/core';
import {generateRandomDicePositions} from "../../helpers/generate-random-dice-positions";
import {HubService} from "../Hub/hub.service";
import {Router} from "@angular/router";
import {BaseGameService} from "./base-game.service";

@Injectable({
  providedIn: 'root'
})
export class OnlineGameService extends BaseGameService{
  private hubService = inject(HubService);
  private router = inject(Router);
  private notifiedEnding = false;
  private globalPlayerId: number = -1;

  constructor() {
    super();
    this.innitCallbacks();
    this.gameEnded.next(0);
  }


  /**
   *
   * Initializes backend callbacks for the given room.
   * Player will always be considered as "PLAYER 1" locally.
   * */
  public innitCallbacks(){
    this.hubService.onGameEnd().subscribe((scrs)=>{
      const scores = String(scrs).split(":");
      console.log(scrs);
      if(this.globalPlayerId==0){
        this.total1.set(Number(scores[0]));
        this.total2.set(Number(scores[1]));
      }else{
        this.total1.set(Number(scores[1]));
        this.total2.set(Number(scores[0]));
      }
      if(!this.notifiedEnding) {
        console.log("Game Ended");
        this.gameEnded.next(1);
      }
      this.notifiedEnding = true;
    })
    this.hubService.onRoomClosed().subscribe(()=>{
      this.canPlayAgain.set(false);
      if(!this.notifiedEnding) {
        console.log("room closed");
        this.gameEnded.next(1);
      }
      this.notifiedEnding = true;
    });
    this.hubService.onGameReset().subscribe(()=>{
      console.log("Game Reset");
      this.notifiedEnding = false;
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

          const game = this.getGameStateValue();
          const currentPlayer = game.currentPlayerIndex;
          this.calculateScoreCard(currentPlayer);
          const yahtzee = this.rulesService.calculateYahtzee(game.dice) > 0;
          const picked = game.players[currentPlayer].scoreCard.yahtzee.picked;
          const nbrOfYahtzee = this.getNbrOfYahtzee();
          if (yahtzee && !picked)
            this.animationService.displayYahtzee(false, nbrOfYahtzee);
          if (yahtzee && picked)
            this.animationService.displayYahtzee(true, nbrOfYahtzee);
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
    console.log('inniting game with code, ', this.hubService.roomCode)
    super.resetGame();
    this.updatePlayerName(0, this.localStorageService.getData('playerName', this.platformId) ||
      'Player 1');
    this.updatePlayerName(1, this.localStorageService.getData('playerTwoName', this.platformId) ||
      'Player 2');
    this.notifiedEnding = false;
    this.canPlayAgain.set(true);
    if(!this.hubService.IsInRoom){
      this.router.navigate(['/']);
    }
    this.rollCounter = -1;
    this.updateGameState({
      dicePositions: generateRandomDicePositions(),
    });
    this.globalPlayerId = Number(this.localStorageService.getData("GlobalId", this.platformId));
  }

  public override destroyGame() {
    this.hubService.quitRoom(this.hubService.roomCode);
    super.resetGame();
    this.rollCounter = -1;
    this.gameEnded.next(0);
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
    this.hubService.hideDice(this.hubService.roomCode, dice);
  }

  rollDice(): void {
    const game = this.getGameStateValue();
    let currentPlayer = game.currentPlayerIndex;
    if (this.rollCounter <2) {
      this.hubService.StartingPlayerRoll(this.hubService.roomCode);
      console.log(this.hubService.roomCode);
      this.beforeGame.set(true)
    } else {
      this.rollDiceInsideGame();
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
    this.hubService.rollDice(this.hubService.roomCode);
  }



  override resetGame(): void {
    this.hubService.requestPlayAgain(this.hubService.roomCode);
  }


  scoreChosen(score: string): void {
    console.log(score);
    this.hubService.chooseScore(this.hubService.roomCode, score);
  }

  startTimer(): void {
    // do nothing
  }

  toggleTimer(): boolean {
    return false;
  }
}
