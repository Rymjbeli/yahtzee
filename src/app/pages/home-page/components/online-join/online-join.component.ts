import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonPrimaryComponent } from '../../../../shared/components/buttons/button-primary/button-primary.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-online-join',
  standalone: true,
  imports: [InputComponent, ButtonPrimaryComponent, TranslatePipe],
  templateUrl: './online-join.component.html',
  styleUrl: './online-join.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnlineJoinComponent {
  @Input() roomCode: string = '';
  @Input() roomMessage: string = '';
  @Output() joinRoom = new EventEmitter<{ roomCode: string }>();

  join() {
    this.joinRoom.emit({ roomCode: this.roomCode });
  }
}
