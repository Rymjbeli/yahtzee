import {Injectable} from '@angular/core';

import {environment} from "../../../app.environment";
import {defer, first, Observable} from "rxjs";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {MyLogger} from "../../helpers/BlankLogger";

@Injectable({
  providedIn: 'root'
})

export class HubService {

  hubConnection !: HubConnection;
  IsConnected : boolean = false;
  IsInRoom : boolean = false;
  roomCode: string = "";
  roomCreated : Observable<string>;
  roomFilled : Observable<string>;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrl +"/Game",{
        skipNegotiation:true,
        transport : HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(new MyLogger())
      .build();

    this.roomFilled = new Observable<string>((observer) => {
      this.hubConnection.on('RoomJoining', (message: string) => {
        if(message!="0"){this.IsInRoom= true;}
        observer.next(message);
      });
    });

    this.roomCreated = new Observable<string>((observer) => {
      this.hubConnection.on('RoomCreation', (message: string) => {
        if(message!="0"){
          this.IsInRoom= true;
          this.roomCode = message;
        }
        observer.next(message);
      });
    });
  }

  startConnection(): Observable<void> {
    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          this.IsConnected = true;
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          this.IsConnected = false;
          this.IsInRoom = false;
          observer.complete();
        });
    });
  }
  checkRoom(roomCode: string){
    return defer(()=> {
      this.hubConnection.invoke("CheckIfRoomExists", String(roomCode));
        return new Observable<string>((observer) => {
          this.hubConnection.on('RoomCodeStatus', (message: string) => {
            observer.next(message);
          });
        });
      }
    ).pipe(first());
  }
  createRoom(playerName: string){
    this.hubConnection.invoke("CreateRoom",String(playerName));
    return this.roomCreated.pipe(first());
  }
  JoinRoom(roomCode: string, playerName: string) : Observable<string>{
    this.hubConnection.invoke("JoinRoom", String(roomCode), String(playerName));
    this.roomCode = roomCode;
    return this.roomFilled.pipe(first());
  }

  onAllPlayersJoined(){
    return this.roomFilled.pipe(first());
  }
  onStartingPlayerRoll() : Observable<string>{
    return new Observable<string>((observer) => {
      this.hubConnection.on('StartingRoll', (message: string) => {
        observer.next(message);
      });
    });
  }
  onSetDice(): Observable<any>{
    return new Observable<any>((observer) => {
      this.hubConnection.on('SetDice', (message: any) => {
        observer.next(message);
      });
    });
  }
  onHideDice(): Observable<any>{
    return new Observable<any>((observer) => {
      this.hubConnection.on('HideDice', (message: any) => {
        observer.next(message);
      });
    });
  }
  onGameStart() : Observable<any>{
    return new Observable<any>((observer) => {
      this.hubConnection.on('StartGame', (message: any) => {
        observer.next(message);
      });
    });
  }
  hideDice(roomCode: string, dice : string){
    this.hubConnection.invoke("HoldDice", String(roomCode), String(dice));
  }

  chooseScore(roomCode: string, dice : string){
    this.hubConnection.invoke("SelectField", String(roomCode), String(dice));
  }
  requestPlayAgain(roomCode: string){
    this.hubConnection.invoke("PlayAgain", String(roomCode));
  }

  quitRoom(roomCode: string){
    if(this.IsInRoom) {
      this.hubConnection.invoke("QuitRoom", String(roomCode));
    }
    this.IsInRoom = false;
  }
  onGameEnd(){
    return new Observable<any>((observer) => {
      this.hubConnection.on('GameSummery', (message: any) => {
        observer.next(message);
      });
    });
  }
  onRoomClosed(){
    return new Observable<any>((observer) => {
      this.hubConnection.on('RoomClosure', (message: any) => {
        this.IsInRoom = false;
        observer.next(message);
      });
    });
  }
  onGameReset(){
    return new Observable<any>((observer) => {
      this.hubConnection.on('RestartGame', (message: any) => {
        this.IsInRoom = false;
        observer.next(message);
      });
    });
  }
  onScoreChosen(){
    return new Observable<any>((observer) => {
      this.hubConnection.on('FieldSelection', (message: any) => {
        observer.next(message);
      });
    });
  }
  rollDice(roomCode: string){
    this.hubConnection.invoke("RollDice", String(roomCode));
  }
  StartingPlayerRoll(roomCode: string){
    this.hubConnection.invoke("StartingPlayerRoll", String(roomCode));
  }
}
