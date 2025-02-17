import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { ButtonPrimaryComponent } from '../../../../shared/components/buttons/button-primary/button-primary.component';
import {
  DropdownComponent,
  Option,
} from '../../../../shared/components/dropdown/dropdown.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-choose-game-mode',
  standalone: true,
  imports: [ButtonPrimaryComponent, DropdownComponent, TranslatePipe],
  templateUrl: './choose-game-mode.component.html',
  styleUrl: './choose-game-mode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChooseGameModeComponent {
  @Input() options: Option[] = [];
  @Input() disabledOnline: boolean = false;
  @Output() playLocllyEvent = new EventEmitter<void>();
  @Output() playOnlineEvent = new EventEmitter<Option>();

  playLocally() {
    this.playLocllyEvent.emit();
  }

  playOnline($event: Option) {
    this.playOnlineEvent.emit($event);
  }
}
