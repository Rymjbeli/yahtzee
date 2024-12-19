import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
