import {inject, Inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {CONSTANTS} from "../../../../config/const.config";
import {LocalStorageService} from "../shared/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class GameModeService {
  private gameMode = signal(CONSTANTS.GAME_MODE.LOCAL)
  private localStorageService = inject(LocalStorageService);
  private platformId = inject(PLATFORM_ID);
  constructor() { }

  get mode() {
    return this.gameMode.asReadonly();
  }

  setGameMode(mode: string): void {
    this.gameMode.set(mode);
    this.localStorageService.saveData('gameMode', mode, this.platformId);
  }

  get isOnlineMode() {
    return this.gameMode() === CONSTANTS.GAME_MODE.ONLINE;
  }
}
