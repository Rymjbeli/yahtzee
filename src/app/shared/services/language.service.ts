import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {CONSTANTS} from "../../../config/const.config";
import {TranslateService} from "@ngx-translate/core";
import {isPlatformBrowser} from "@angular/common";
import {LanguageInterface} from "../interfaces/language.interface";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  languages: LanguageInterface[] = [
    { name: CONSTANTS.LANGUAGES.ENGLISH, code: CONSTANTS.LANGUAGES.EN },
    { name: CONSTANTS.LANGUAGES.ARABIC, code: CONSTANTS.LANGUAGES.AR },
    { name: CONSTANTS.LANGUAGES.SPANISH, code: CONSTANTS.LANGUAGES.ES },
    { name: CONSTANTS.LANGUAGES.FRENCH, code: CONSTANTS.LANGUAGES.FR },
  ];
  languageSettings(): void {
    const supportedLanguages = this.languages.map(lang => lang.code);
    this.translate.addLangs(supportedLanguages);
    this.translate.setDefaultLang(CONSTANTS.LANGUAGES.EN);
    if(isPlatformBrowser(this.platformId)) {
      const storedLang = localStorage.getItem(CONSTANTS.LANGUAGES.LANG);
      const defaultLang = storedLang ? JSON.parse(storedLang).code : CONSTANTS.LANGUAGES.EN;
      this.translate.use(defaultLang);
    }
  }

  setLanguage(lang: LanguageInterface): void {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.setItem(CONSTANTS.LANGUAGES.LANG, JSON.stringify(lang));
      this.translate.use(lang.code);
    }
  }

  getLanguage(): LanguageInterface {
    if (isPlatformBrowser(this.platformId)) {
      const storedLang = localStorage.getItem(CONSTANTS.LANGUAGES.LANG);
      return storedLang ? JSON.parse(storedLang) : { name: CONSTANTS.LANGUAGES.ENGLISH, code: CONSTANTS.LANGUAGES.EN };
    }
    return { name: CONSTANTS.LANGUAGES.ENGLISH, code: CONSTANTS.LANGUAGES.EN };
  }
}
