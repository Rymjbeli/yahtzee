import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { SettingsPopupComponent } from '../../popups/settings-popup/settings-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/shared/local-storage.service';
import {BaseGameService} from "../../../services/game/base-game.service";
import {GameManagerService} from "../../../services/game/game-manager.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HelpSupportPopupComponent} from "../../popups/help-support-page/help-support-popup.component";

@Component({
  selector: 'app-small-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './small-navbar.component.html',
  styleUrl: './small-navbar.component.scss',
})
export class SmallNavbarComponent {
  @Input() size: 'md' | 'lg' | 'sm' = 'md';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  gameService!: BaseGameService;
  gameManagerService = inject(GameManagerService);

  localStorageService = inject(LocalStorageService);
  router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  dialog = inject(MatDialog);

  constructor() {
    // Subscribe to the current game service
    this.gameManagerService.currentGameService
      .pipe(takeUntilDestroyed())
      .subscribe((gameService) => {
      this.gameService = gameService!;
    });
  }
  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  openSettings() {
    this.dialog.open(SettingsPopupComponent, {
      width: '300px',
      disableClose: true,
    });
  }

  openHelpSupport() {
    if (!this.disabled) {
      this.dialog.open(HelpSupportPopupComponent, {
        width: '500px',
        disableClose: true,
      });
    }
  }

  redirectToHome(): void {
    this.localStorageService.removeData('step', this.platformId);
    this.localStorageService.removeData('gameMode', this.platformId);

    this.gameService.resetGame();
    this.router.navigate(['/']);
  }
}
