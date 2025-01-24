import {BaseGameService} from "../services/game/base-game.service";
import {inject, PLATFORM_ID} from "@angular/core";
import {LocalStorageService} from "../services/shared/local-storage.service";
import {OnlineGameService} from "../services/game/online-game.service";
import {GameService} from "../services/game/game.service";

export function gameFactory(): BaseGameService {
  const platformId = inject(PLATFORM_ID);
  const localStorageService = inject(LocalStorageService);

  const gameMode = localStorageService.getData('gameMode', platformId);
  console.log('gameMode', gameMode)
  return gameMode === 'online' ?
    new OnlineGameService() :
    new GameService();
}
