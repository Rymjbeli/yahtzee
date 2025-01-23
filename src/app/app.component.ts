import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import { RouterModule } from '@angular/router';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {LanguageService} from "./shared/services/settings/language.service";
import {HubService} from "./shared/services/Hub/hub.service";
import {isPlatformServer} from "@angular/common";
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
  platformId = inject(PLATFORM_ID);
  hubService = inject(HubService);
  ngOnInit(): void {
    this.languageService.languageSettings();
    if (!isPlatformServer(this.platformId)) {
      this.hubService.startConnection().subscribe();
    }
  }
}
