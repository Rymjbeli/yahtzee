import {Component, inject, OnInit} from '@angular/core';
import { SmallNavbarComponent } from '../small/small-navbar.component';
import { ButtonSecondaryComponent } from '../../buttons/button-secondary/button-secondary.component';
import {BaseGameService} from "../../../services/game/base-game.service";
import {GameManagerService} from "../../../services/game/game-manager.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CONSTANTS} from "../../../../../config/const.config";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [SmallNavbarComponent, ButtonSecondaryComponent, NgStyle],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
})
export class MainNavbarComponent implements OnInit {
  gameService!: BaseGameService;
  gameManagerService = inject(GameManagerService);

  gameMode = this.gameManagerService.gameMode;
  constructor() {
    // Subscribe to the current game service
    this.gameManagerService.currentGameService
      .pipe(takeUntilDestroyed())
      .subscribe((gameService) => {
      this.gameService = gameService!;
    });
  }

  ngOnInit(): void {
  }

  resetGame(): void {
    this.gameService.resetGame();
  }

  protected readonly CONSTANTS = CONSTANTS;
}
