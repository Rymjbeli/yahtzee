import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-roll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-roll.component.html',
  styleUrl: './button-roll.component.scss'
})
export class ButtonRollComponent {
  @Input() text: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'normal' | 'disabled' = 'normal';
}
