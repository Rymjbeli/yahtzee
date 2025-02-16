import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-button-primary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-primary.component.html',
  styleUrl: './button-primary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonPrimaryComponent {

  @Input() text: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'normal' | 'disabled' = 'normal';
  @Input() buttonType: 'button' | 'submit' = 'button';
  @Input() showRightIcon: boolean = false;
  @Input() showLeftIcon: boolean = false;
}
