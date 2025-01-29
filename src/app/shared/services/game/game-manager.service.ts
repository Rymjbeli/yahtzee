import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BaseGameService} from "./base-game.service";
import {LocalStorageService} from "../shared/local-storage.service";
import {CONSTANTS} from "../../../../config/const.config";
import {OnlineGameService} from "./online-game.service";
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {
  public currentGameService! : BaseGameService;
  localStorageService = inject(LocalStorageService);
  platformId = inject(PLATFORM_ID);
  gameService =inject(GameService);
  onlineGameService = inject(OnlineGameService);
  constructor() {
    this.switchService();
  }

  switchService(): void {
    const gameMode = this.gameMode;
    this.currentGameService =
      gameMode === CONSTANTS.GAME_MODE.ONLINE
        ? this.onlineGameService
        : this.gameService;
  }

  get gameMode(): string {
    return this.localStorageService.getData(CONSTANTS.GAME_MODE.GAME_MODE, this.platformId)
      || CONSTANTS.GAME_MODE.LOCAL;
  }

}
