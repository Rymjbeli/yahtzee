import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import { RuleContainerComponent } from "../../shared/components/rule-container/rule-container.component";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface Rule {
  title: string;
  description: string;
}

export interface RulesPage {
  [key: string]: Rule;
}

export interface RulesData {
  [page: string]: RulesPage;
}

@Component({
  selector: 'app-game-rules',
  standalone: true,
  imports: [
    RuleContainerComponent,
    TranslatePipe,
    CommonModule,
    NgOptimizedImage
  ],
  templateUrl: './game-rules.component.html',
  styleUrls: ['./game-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameRulesComponent {
  private translate = inject(TranslateService);
  rules = signal<RulesData>({});
  currentPageIndex = signal<number>(0);
  pages = computed(() => Object.keys(this.rules()));

  currentPageRules = computed(() => {
    const currentPage = this.rules()[this.pages()[this.currentPageIndex()]] || {};
    return Object.values(currentPage);
  });

  constructor() {
    this.translate
      .stream('rules')
      .pipe(takeUntilDestroyed())
      .subscribe((rules: RulesData) => {
        this.rules.update(() => rules);
      });
  }

  nextPage(): void {
    if (this.currentPageIndex() < this.pages().length - 1) {
      this.currentPageIndex.update(index => index + 1);
    }
  }

  previousPage(): void {
    if (this.currentPageIndex() > 0) {
      this.currentPageIndex.update(index => index - 1);
    }
  }
}
