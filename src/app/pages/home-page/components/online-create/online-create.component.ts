import { Component, Input } from '@angular/core';
import { SmallLoaderComponent } from '../../../../shared/components/loaders/small-loader/small-loader.component';

@Component({
  selector: 'app-online-create',
  standalone: true,
  imports: [SmallLoaderComponent],
  templateUrl: './online-create.component.html',
  styleUrl: './online-create.component.scss',
})
export class OnlineCreateComponent {
  @Input() playerName: string = '';
  @Input() roomCode: string = '';
}
