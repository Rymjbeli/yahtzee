import {BaseGameService} from "../services/game/base-game.service";
import {inject, PLATFORM_ID} from "@angular/core";
import {LocalStorageService} from "../services/shared/local-storage.service";
import {OnlineGameService} from "../services/game/online-game.service";
import {GameService} from "../services/game/game.service";
import {DiceService} from "../services/game/dice.service";
import {RulesService} from "../services/game/rules.service";
import {AnimationsService} from "../services/animation/animations.service";
import {HubService} from "../services/Hub/hub.service";
import {ActivatedRoute} from "@angular/router";

export function gameFactory(): BaseGameService {
  const platformId = inject(PLATFORM_ID);
  const localStorageService = inject(LocalStorageService);
  const diceService = inject(DiceService);
  const rulesService = inject(RulesService);
  const animationService = inject(AnimationsService);
  const hubService = inject(HubService);
  const activatedRoute = inject(ActivatedRoute);

  const gameMode = localStorageService.getData('gameMode', platformId);
  console.log('gameMode', gameMode)
  return gameMode === 'online' ?
    new OnlineGameService(
      diceService,
      rulesService,
      animationService,
      hubService,
      activatedRoute,
      platformId,
    ) :
    new GameService(
      diceService,
      rulesService,
      animationService,
      platformId
    );
}
