import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { ButtonPrimaryComponent } from '../../shared/components/buttons/button-primary/button-primary.component';
import { LargeLoaderComponent } from '../../shared/components/loaders/large-loader/large-loader.component';
import { Option } from '../../shared/components/dropdown/dropdown.component';
import { SettingsNavBarComponent } from '../../shared/components/navbar/settings/settings-navbar.component';
import { GameService } from '../../shared/services/game/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/shared/local-storage.service';
import { OnlineJoinComponent } from './components/online-join/online-join.component';
import { OnlineCreateComponent } from './components/online-create/online-create.component';
import { InputPlayerNameComponent } from './components/input-player-name/input-player-name.component';
import { ChooseGameModeComponent } from './components/choose-game-mode/choose-game-mode.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HubService } from '../../shared/services/Hub/hub.service';
import { SoundService } from '../../shared/services/settings/sound.service';
import { GameManagerService } from '../../shared/services/game/game-manager.service';
import { NgOptimizedImage } from '@angular/common';
import { CONSTANTS } from '../../../config/const.config';
import {of, Subject, switchMap, takeUntil, tap} from "rxjs";
import {
  GAME_MODE_ENUM,
  ONLINE_OPTION_ENUM,
} from '../../shared/enums/game-mode.enum';

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
    NgOptimizedImage,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  cdr = inject(ChangeDetectorRef);
  localStorageService = inject(LocalStorageService);
  roomMessage = '';
  step: number = 1;
  gameMode: GAME_MODE_ENUM | null = null;
  onlineOption: ONLINE_OPTION_ENUM | null = null;
  playerName = 'game_board.player1';
  playerTwoName = 'game_board.player2';
  roomCode = '';
  LOCAL_STORAGE = CONSTANTS.LOCALE_STORAGE;
  // online options
  options: Option[] = [
    { value: CONSTANTS.ONLINE_OPTION.CREATE, label: 'home.createNewRoom' },
    { value: CONSTANTS.ONLINE_OPTION.JOIN, label: 'home.joinExistingRoom' },
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
    this.step = parseInt(this.retrieveFromLocalStorage(CONSTANTS.LOCALE_STORAGE.STEP) || '1', 10);
    if (this.step == 4) {
      this.step = 1;
    }
    this.gameMode =
      (this.retrieveFromLocalStorage(CONSTANTS.LOCALE_STORAGE.GAME_MODE) as GAME_MODE_ENUM | null) ||
      null;
    this.onlineOption =
      (this.retrieveFromLocalStorage(CONSTANTS.LOCALE_STORAGE.ONLINE_OPTION) as ONLINE_OPTION_ENUM) ||
      null;
    this.playerName =
      this.retrieveFromLocalStorage(CONSTANTS.LOCALE_STORAGE.PLAYER_NAME) || 'game_board.player1';
    this.playerTwoName =
      this.retrieveFromLocalStorage(CONSTANTS.LOCALE_STORAGE.PLAYER_TWO_NAME) || 'game_board.player2';
    this.roomCode = this.retrieveFromLocalStorage(CONSTANTS.LOCALE_STORAGE.ROOM_CODE) || 'home.waiting';
  }

  nextStep() {
    if (this.step === 3 && this.onlineOption === CONSTANTS.ONLINE_OPTION.JOIN) {
      this.roomCode = '';
    }
    if (this.step === 3 && this.onlineOption === CONSTANTS.ONLINE_OPTION.CREATE) {
      this.hubService.createRoom(this.playerName).subscribe((res) => {
        if (res != '0') {
          this.roomCode = res;
          this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.ROOM_CODE, this.roomCode);
          this.hubService.onAllPlayersJoined().subscribe((playerNames) => {
            this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.GLOBAL_ID, '0');
            this.playerTwoName = playerNames.split(':')[1];
            this.startOnlineGame();
          });
          this.cdr.markForCheck();
        }
      });
    }
    if (this.step === 3) {
      this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.PLAYER_NAME, this.playerName);
    }
    if (this.step === 4 && this.gameMode === CONSTANTS.GAME_MODE.ONLINE) {
      this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.PLAYER_TWO_NAME, this.playerTwoName);
    }
    this.step++;
    this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.STEP, this.step.toString());
  }

  previousStep() {
    this.step--;
    this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.STEP, this.step.toString());
  }

  playOnline($event: Option) {
    if (!this.hubService.IsConnected) {
      alert(
        "Couldn't establish a connection with the server, please check your internet."
      );
      return;
    }
    this.gameMode = GAME_MODE_ENUM.LOCAL;
    this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.GAME_MODE, this.gameMode);
    this.onlineOption = $event.value as ONLINE_OPTION_ENUM;
    this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.ONLINE_OPTION, this.onlineOption);
    this.roomMessage = '';
    this.nextStep();
    this.gameManagerService.switchService();
  }

  // decide to play locally
  playLocally() {
    this.gameMode = GAME_MODE_ENUM.LOCAL;
    this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.GAME_MODE, this.gameMode);
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
      this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.PLAYER_NAME, this.playerName);
      this.nextStep();
    } else {
      this.playerTwoName = event;
      this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.PLAYER_TWO_NAME, this.playerTwoName);
      this.startLocalGame();
    }
  }

  saveToLocalStorage(key: string, value: string) {
    this.localStorageService.saveData(key, value, this.platformId);
  }

  retrieveFromLocalStorage(key: string): string {
    return this.localStorageService.getData(key, this.platformId);
  }
  private destroy$ = new Subject<void>();

  joinRoom($event: { roomCode: string }): void {
    this.roomCode = $event.roomCode;

    this.hubService.checkRoom(this.roomCode).pipe(
      switchMap((res) => {
        const roomExists = res.split(':')[1] !== "False";
        if (!roomExists) {
          return this.translateService.stream('home.room_message').pipe(
            tap((translatedMessage) => {
              this.roomMessage = translatedMessage;
            }),
            switchMap(() => of(null))
          );
        }

        this.roomMessage = '';
        this.saveToLocalStorage('roomCode', this.roomCode);

        return this.hubService.JoinRoom(this.roomCode, this.playerName).pipe(
          tap((playerNames) => {
            this.playerTwoName = playerNames.split(':')[0];
            this.saveToLocalStorage("GlobalId", "1");
            this.startOnlineGame();
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  startOnlineGame() {
    this.saveToLocalStorage(CONSTANTS.LOCALE_STORAGE.PLAYER_TWO_NAME, this.playerTwoName);
    this.router.navigate(['/game']);
  }
  playSound(): void {
    this.soundService.playSound();
  }
}
