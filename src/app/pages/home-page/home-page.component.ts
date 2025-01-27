import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ButtonPrimaryComponent } from '../../shared/components/buttons/button-primary/button-primary.component';
import { LargeLoaderComponent } from '../../shared/components/loaders/large-loader/large-loader.component';
import {
  DropdownComponent,
  Option,
} from '../../shared/components/dropdown/dropdown.component';
import { SettingsNavBarComponent } from '../../shared/components/navbar/settings/settings-navbar.component';
import { GameService } from '../../shared/services/game/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/shared/local-storage.service';
import { OnlineJoinComponent } from './components/online-join/online-join.component';
import { OnlineCreateComponent } from './components/online-create/online-create.component';
import { InputPlayerNameComponent } from './components/input-player-name/input-player-name.component';
import { ChooseGameModeComponent } from './components/choose-game-mode/choose-game-mode.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {HubService} from "../../shared/services/Hub/hub.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SoundService} from "../../shared/services/settings/sound.service";
import {GameManagerService} from "../../shared/services/game/game-manager.service";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ButtonPrimaryComponent,
    SettingsNavBarComponent,
    LargeLoaderComponent,
    OnlineJoinComponent,
    OnlineCreateComponent,
    InputPlayerNameComponent,
    ChooseGameModeComponent,
    TranslatePipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  [x: string]: any;
  gameService = inject(GameService);
  gameManagerService = inject(GameManagerService);
  translateService = inject(TranslateService);
  soundService = inject(SoundService);
  router = inject(Router);
  hubService = inject(HubService);
  platformId = inject(PLATFORM_ID);
  route = inject(ActivatedRoute);
  localStorageService = inject(LocalStorageService);
  roomMessage = '';
  step: number = 1;
  gameMode: 'online' | 'local' | null = null;
  onlineOption: 'create' | 'join' | null = null;
  playerName = 'Player 1';
  playerTwoName = 'Player 2';
  roomCode = '';
  // online options
  options: Option[] = [
    { value: 'create', label: 'home.createNewRoom' },
    { value: 'join', label: 'home.joinExistingRoom' },
  ];
  selectedOption: Option | null = null;

  ngOnInit() {
    // reload data from local storage after navigation (to the same url)
    this.route.queryParams.subscribe((params) => {
      if (params['reload']) {
        this.reloadLocalStorageData();
      }
    });

    // initial load of data from local storage
    this.reloadLocalStorageData();
  }

  reloadLocalStorageData() {
    this.step = parseInt(this.retrieveFromLocalStorage('step') || '1', 10);
    if(this.step==4){this.step=1;}
    this.gameMode =
      (this.retrieveFromLocalStorage('gameMode') as
        | 'online'
        | 'local'
        | null) || null;
    this.onlineOption =
      (this.retrieveFromLocalStorage('onlineOption') as 'create' | 'join') ||
      null;
    this.playerName = this.retrieveFromLocalStorage('playerName') || 'Player 1';
    this.playerTwoName =
      this.retrieveFromLocalStorage('playerTwoName') || 'Player 2';
    this.roomCode =
      this.retrieveFromLocalStorage('roomCode') ||
      "PLEASE WAIT";
  }

  nextStep() {
    if (this.step === 3 && this.onlineOption === 'join') {
      this.roomCode = '';
    }
    if (this.step === 3 && this.onlineOption === 'create') {
      this.hubService.createRoom(this.playerName).subscribe((res)=>{
        if(res != "0"){
          this.roomCode = res;
          this.saveToLocalStorage('roomCode', this.roomCode);
          this.hubService.onSecondPlayerJoined().subscribe((playerNames)=>{
            this.saveToLocalStorage("GlobalId", "0");
            this.saveToLocalStorage('roomCode', this.roomCode);
            this.playerTwoName = playerNames.split(":")[1];
            this.saveToLocalStorage('playerTwoName', this.playerTwoName);
            this.router.navigate(["/game"]);
          })
        }
      });
    }
    if (this.step === 3) {
      this.saveToLocalStorage('playerName', this.playerName);
    }
    if (this.step === 4 && this.gameMode === 'online') {
      this.saveToLocalStorage('playerTwoName', this.playerTwoName);
    }
    this.step++;
    this.saveToLocalStorage('step', this.step.toString());
  }

  previousStep() {
    this.step--;
    this.saveToLocalStorage('step', this.step.toString());
  }

  playOnline($event: Option) {
    if(!this.hubService.IsConnected){
      alert("Couldn't establish a connection with the server, please check your internet.");
      return;
    }
    this.gameMode = 'online';
    this.saveToLocalStorage('gameMode', this.gameMode);
    this.onlineOption = $event.value as 'create' | 'join';
    this.saveToLocalStorage('onlineOption', this.onlineOption);
    this.roomMessage = '';
    this.nextStep();
    this.gameManagerService.switchService();
  }

  // decide to play locally
  playLocally() {
    this.gameMode = 'local';
    this.saveToLocalStorage('gameMode', this.gameMode);
    this.nextStep();
    this.gameManagerService.switchService();
  }

  // start a local game
  startLocalGame() {
    this.gameService.updatePlayerName(0, this.playerName);
    this.gameService.updatePlayerName(1, this.playerTwoName);
    this.router.navigate(['/game']);
  }

  saveName(event: string, playerNumber: number) {
    if (playerNumber === 1) {
      this.playerName = event;
      this.saveToLocalStorage('playerName', this.playerName);
      this.nextStep();
    } else {
      this.playerTwoName = event;
      this.saveToLocalStorage('playerTwoName', this.playerTwoName);
      this.startLocalGame();
    }
  }

  // skipName(step: number) {
  //   if (step === 1) {
  //     this.playerName = 'Player 1';
  //   }
  //   if (step === 2) {
  //     this.playerTwoName = 'Player 2';
  //   }
  //   this.nextStep();
  // }

  saveToLocalStorage(key: string, value: string) {
    this.localStorageService.saveData(key, value, this.platformId);
  }

  retrieveFromLocalStorage(key: string): string {
    return this.localStorageService.getData(key, this.platformId);
  }

  joinRoom($event: { roomCode: string }) {
    this.roomCode = $event.roomCode;
    this.hubService.checkRoom(this.roomCode).subscribe((res)=>{
      if(res.split(':')[1] == "False") {
        this.translateService.stream('home.room_message').subscribe((res) => {
          this.roomMessage = res;
        });
        // alert("Room does not exist.");
      } else {
        this.roomMessage = '';
        this.saveToLocalStorage('roomCode', this.roomCode);
        this.hubService.JoinRoom(this.roomCode, this.playerName).subscribe((playerNames)=>{
          this.playerTwoName = playerNames.split(":")[0];
          this.saveToLocalStorage('playerTwoName', this.playerTwoName);
          this.saveToLocalStorage("GlobalId", "1");
          this.router.navigate(["/game"]);
        });
      }
    });
  }

  playSound(): void {
    this.soundService.playSound();
  }
}
