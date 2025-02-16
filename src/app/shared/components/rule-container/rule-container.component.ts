import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
@Component({
  selector: 'app-rule-container',
  standalone: true,
  imports: [MarkdownComponent],
  templateUrl: './rule-container.component.html',
  styleUrl: './rule-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuleContainerComponent {
  @Input() ruleTitle: string = 'Rule Title';
  @Input() descriptionMarkdown : string = '__Rule Description__';
}
