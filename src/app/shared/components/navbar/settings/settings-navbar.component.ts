import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsPopupComponent } from '../../popups/settings-popup/settings-popup.component';

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

  dialog = inject(MatDialog);

  openSettings() {
    if (!this.disabled) {
      this.dialog.open(SettingsPopupComponent, {
        width: '300px',
        disableClose: true,
      });
    }
  }
}
