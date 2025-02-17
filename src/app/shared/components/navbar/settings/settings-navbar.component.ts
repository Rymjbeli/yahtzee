import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsPopupComponent } from '../../popups/settings-popup/settings-popup.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/shared/local-storage.service';
import {HelpSupportPopupComponent} from "../../popups/help-support-page/help-support-popup.component";

@Component({
  selector: 'app-settings-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-navbar.component.html',
  styleUrl: './settings-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
        width: '350px',
        disableClose: true,
      });
    }
  }

  openHelpSupport() {
    if (!this.disabled) {
      this.dialog.open(HelpSupportPopupComponent, {
        width: '500px',
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
