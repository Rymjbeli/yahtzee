import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-small-loader',
  standalone: true,
  imports: [],
  templateUrl: './small-loader.component.html',
  styleUrl: './small-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmallLoaderComponent {

}
