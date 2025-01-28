import {BaseGameService} from "../services/game/base-game.service";
import {inject, PLATFORM_ID} from "@angular/core";
import {OnlineGameService} from "../services/game/online-game.service";
import {GameService} from "../services/game/game.service";
import {CONSTANTS} from "../../../config/const.config";
import {LocalStorageService} from "../services/shared/local-storage.service";

export function gameFactory(): BaseGameService {
  const localStorageService = inject(LocalStorageService);
  const platformId = inject(PLATFORM_ID);
  const gameMode = localStorageService.getData(CONSTANTS.GAME_MODE.GAME_MODE, platformId)
  return gameMode === CONSTANTS.GAME_MODE.ONLINE ?
    new OnlineGameService() :
    new GameService();
}
