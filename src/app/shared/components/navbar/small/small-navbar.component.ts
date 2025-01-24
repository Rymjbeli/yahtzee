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
import { GameService } from '../../../services/game/game.service';
import { LocalStorageService } from '../../../services/shared/local-storage.service';

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

  gameService = inject(GameService);
  localStorageService = inject(LocalStorageService);
  router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  dialog = inject(MatDialog);

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

  redirectToHome(): void {
    this.localStorageService.removeData('step', this.platformId);
    this.localStorageService.removeData('gameMode', this.platformId);

    this.gameService.resetGame();
    this.router.navigate(['/']);
  }
}
