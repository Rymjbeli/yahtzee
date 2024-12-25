import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
