import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { SmallLoaderComponent } from '../../../../shared/components/loaders/small-loader/small-loader.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-online-create',
  standalone: true,
  imports: [SmallLoaderComponent, TranslatePipe],
  templateUrl: './online-create.component.html',
  styleUrl: './online-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnlineCreateComponent {
  @Input() playerName: string = '';
  @Input() roomCode: string = '';
}
