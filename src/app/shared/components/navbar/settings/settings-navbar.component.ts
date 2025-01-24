import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsPopupComponent } from '../../popups/settings-popup/settings-popup.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/shared/local-storage.service';

@Component({
  selector: 'app-settings-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-navbar.component.html',
  styleUrl: './settings-navbar.component.scss',
})
export class SettingsNavBarComponent {
  @Input() size: 'md' | 'lg' | 'sm' = 'md';
  @Input() disabled: boolean = false;
  localStorageService = inject(LocalStorageService);

  dialog = inject(MatDialog);
  router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  openSettings() {
    if (!this.disabled) {
      this.dialog.open(SettingsPopupComponent, {
        width: '300px',
        disableClose: true,
      });
    }
  }
  redirectToHome() {
    this.localStorageService.removeData('step', this.platformId);
    this.localStorageService.removeData('gameMode', this.platformId);

    this.router.navigate(['/'], { queryParams: { reload: new Date() } });
  }
}
