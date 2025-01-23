import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonPrimaryComponent } from '../../../../shared/components/buttons/button-primary/button-primary.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-input-player-name',
  standalone: true,
  imports: [InputComponent, ButtonPrimaryComponent, TranslatePipe],
  templateUrl: './input-player-name.component.html',
  styleUrl: './input-player-name.component.scss',
})
export class InputPlayerNameComponent {
  @Input() playerName: string = '';
  @Input() message: string = '';
  @Output() submitEvent = new EventEmitter<string>();
  @Output() previousEvent = new EventEmitter<void>();

  submitName() {
    this.submitEvent.emit(this.playerName);
  }

  previous() {
    this.previousEvent.emit();
  }
}
