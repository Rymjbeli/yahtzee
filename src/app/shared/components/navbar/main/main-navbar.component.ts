import { Component, inject } from '@angular/core';
import { SmallNavbarComponent } from '../small/small-navbar.component';
import { SettingsNavBarComponent } from '../settings/settings-navbar.component';
import { ButtonSecondaryComponent } from '../../buttons/button-secondary/button-secondary.component';
import { GameService } from '../../../services/game/game.service';
import {BaseGameService} from "../../../services/game/base-game.service";

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [SmallNavbarComponent, ButtonSecondaryComponent],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
})
export class MainNavbarComponent {
  gameService = inject(BaseGameService);

  resetGame(): void {
    this.gameService.resetGame();
  }
}
