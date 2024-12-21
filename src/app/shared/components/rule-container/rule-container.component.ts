import { Component, Input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
@Component({
  selector: 'app-rule-container',
  standalone: true,
  imports: [MarkdownComponent],
  templateUrl: './rule-container.component.html',
  styleUrl: './rule-container.component.scss'
})
export class RuleContainerComponent {
  @Input() ruleTitle: string = 'Rule Title';
  @Input() descriptionItems: string[] = [];

  ngxMarkdownVersion = '17.2.1';

  markdown = `### Markdown __rulez__!
---
---

### Syntax highlight


### Lists
1. Ordered list
2. Another bullet point
   - Unordered list
   - Another unordered bullet

### Blockquote
> Blockquote to the max`;

}
