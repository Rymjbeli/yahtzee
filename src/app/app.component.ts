import {Component, inject, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {LanguageService} from "./shared/services/settings/language.service";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterModule, TranslateModule],
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
