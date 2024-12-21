import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RuleContainerComponent} from "./shared/components/rule-container/rule-container.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {LanguageService} from "./shared/services/language.service";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, RuleContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'yahtzee';
  languageService = inject(LanguageService);
  ngOnInit(): void {
    this.languageService.languageSettings();
  }
}
