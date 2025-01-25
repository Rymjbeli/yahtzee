import { Injectable } from '@angular/core';

import {environment} from "../../../app.environment";
import {defer, first, Observable} from "rxjs";
import {HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class HubService {
  hubConnection !: HubConnection;
  IsConnected : boolean = false;
  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrl +"/Game",{
        skipNegotiation:true,
        transport : HttpTransportType.WebSockets,
      }).build();
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
          //observer.error(error);
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
    return defer(()=>{
      this.hubConnection.invoke("CreateRoom",String(playerName));
      return new Observable<string>((observer) => {
        this.hubConnection.on('RoomCreation', (message: string) => {
          observer.next(message);
        });
      });
    }).pipe(first());
  }
  JoinRoom(roomCode: string, playerName: string) : Observable<string>{
    return defer(()=>{
      this.hubConnection.invoke("JoinRoom", String(roomCode), String(playerName));
      return new Observable<string>((observer) => {
        this.hubConnection.on('RoomJoining', (message: string) => {
          observer.next(message);
        });
      });
    }).pipe(first());
  }

  onSecondPlayerJoined(){
    return new Observable<string>((observer) => {
      this.hubConnection.on('RoomJoining', (message: string) => {
        observer.next(message);
      });
    });
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
    }).pipe(
      first()
    );
  }
  hideDice(roomCode: string, dice : string){
    this.hubConnection.invoke("HoldDice", String(roomCode), String(dice));
  }

  chooseScore(roomCode: string, dice : string){
    this.hubConnection.invoke("SelectField", String(roomCode), String(dice));
  }

  onGameEnd(){
    return new Observable<any>((observer) => {
      this.hubConnection.on('GameSummery', (message: any) => {
        observer.next(message);
      });
    });
  }
  onRoomFilled(){
    return new Observable<any>((observer) => {
      this.hubConnection.on('RoomFull', (message: any) => {
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
