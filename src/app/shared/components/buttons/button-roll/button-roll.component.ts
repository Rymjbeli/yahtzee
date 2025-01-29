import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-button-roll',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './button-roll.component.html',
  styleUrl: './button-roll.component.scss'
})
export class ButtonRollComponent {
  @Input() text: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'normal' | 'disabled' = 'normal';
}
