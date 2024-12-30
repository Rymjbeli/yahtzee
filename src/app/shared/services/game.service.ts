import { Injectable } from '@angular/core';

import {environment} from "../../app.environment";
import {Observable} from "rxjs";
import {HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  hubConnection !: HubConnection;
  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrl +"/Game",{
        skipNegotiation:true,
        transport : HttpTransportType.WebSockets,
      }).build();
  }
  startConnection(): Observable<void> {
    console.log("Starting hub connection...");
    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('Connection established with SignalR hub');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error connecting to SignalR hub:', error);
          observer.error(error);
        });
    });
  }
  onRoomStatusResponse(): Observable<string> {
    return new Observable<string>((observer) => {
      this.hubConnection.on('RoomCodeStatus', (message: string) => {
        observer.next(message);
      });
    });
  }
  onRoomCreationResponse():Observable<string> {
    return new Observable<string>((observer) => {
      this.hubConnection.on('RoomCreation', (message: string) => {
        observer.next(message);
      });
    });
  }
  checkRoom(roomCode: string){
    this.hubConnection.invoke("CheckIfRoomExists", String(roomCode));
  }
  createRoom(roomCode: string){
    this.hubConnection.invoke("CreateRoom", String(roomCode));
  }
}
