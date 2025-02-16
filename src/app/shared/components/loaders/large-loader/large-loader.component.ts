import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-large-loader',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './large-loader.component.html',
  styleUrl: './large-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LargeLoaderComponent {

}
