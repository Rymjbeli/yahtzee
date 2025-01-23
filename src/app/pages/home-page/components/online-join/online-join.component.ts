import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonPrimaryComponent } from '../../../../shared/components/buttons/button-primary/button-primary.component';

@Component({
  selector: 'app-online-join',
  standalone: true,
  imports: [InputComponent, ButtonPrimaryComponent],
  templateUrl: './online-join.component.html',
  styleUrl: './online-join.component.scss',
})
export class OnlineJoinComponent {
  @Input() roomCode: string = '';
  @Output() joinRoom = new EventEmitter<{ roomCode: string }>();

  join() {
    this.joinRoom.emit({ roomCode: this.roomCode });
  }
}
