import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SettingsPopupComponent } from '../../popups/settings-popup/settings-popup.component';
import { MatDialog } from '@angular/material/dialog';

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
}
