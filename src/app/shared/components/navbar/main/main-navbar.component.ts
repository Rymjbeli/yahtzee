import {Component, inject, OnInit, signal} from '@angular/core';
import {SmallNavbarComponent} from '../small/small-navbar.component';
import {ButtonSecondaryComponent} from '../../buttons/button-secondary/button-secondary.component';
import {BaseGameService} from "../../../services/game/base-game.service";
import {GameManagerService} from "../../../services/game/game-manager.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CONSTANTS} from "../../../../../config/const.config";
import {Location, NgStyle} from "@angular/common";
import {Router, NavigationEnd} from '@angular/router';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [SmallNavbarComponent, ButtonSecondaryComponent, NgStyle, TranslatePipe],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
})
export class MainNavbarComponent implements OnInit {
  gameManagerService = inject(GameManagerService);
  gameService = this.gameManagerService.currentGameService;
  location = inject(Location);
  router = inject(Router);

  gameMode = this.gameManagerService.gameMode;
  isGameRulesPage = signal(false);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isGameRulesPage.update(() =>
          event.urlAfterRedirects.includes('rules')
        );
      }
    });
  }

  ngOnInit(): void {
  }

  resetGame(): void {
    this.gameService.resetGame();
  }

  goBack(): void {
    this.location.back();
  }

  protected readonly CONSTANTS = CONSTANTS;
}
