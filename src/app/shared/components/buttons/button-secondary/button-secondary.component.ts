import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-secondary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-secondary.component.html',
  styleUrl: './button-secondary.component.scss'
})
export class ButtonSecondaryComponent {
  @Input() text: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'normal' | 'disabled' = 'normal';
}
