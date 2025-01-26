import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {isPlatformBrowser, NgClass, NgOptimizedImage} from "@angular/common";
import {ButtonPrimaryComponent} from "../../buttons/button-primary/button-primary.component";
import {SoundService} from "../../../services/settings/sound.service";
import {FormsModule} from "@angular/forms";
import {CONSTANTS} from "../../../../../config/const.config";
import {LanguageService} from "../../../services/settings/language.service";
import {LanguageInterface} from "../../../interfaces/language.interface";
import { GameService } from '../../../services/game/game.service';
import {BaseGameService} from "../../../services/game/base-game.service";

@Component({
  selector: 'app-settings-popup',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ButtonPrimaryComponent,
    FormsModule,
    NgClass
  ],
  templateUrl: './settings-popup.component.html',
  styleUrl: './settings-popup.component.scss'
})
export class SettingsPopupComponent implements OnInit{
  private dialogRef = inject(MatDialogRef<SettingsPopupComponent>);
  private soundService = inject(SoundService);
  private languageService = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);
  private gameService = inject(BaseGameService);

  isMusicPlaying = true;
  languages: LanguageInterface[] = [];
  selectedLanguage: LanguageInterface = { name: CONSTANTS.LANGUAGES.ENGLISH, code: CONSTANTS.LANGUAGES.EN };
  dropdownOpen: boolean = false;
  isTimerEnabled: boolean = false;

  ngOnInit(): void {
    this.isMusicPlaying = this.soundService.getMusicState();
    this.languages = this.languageService.languages;
    this.selectedLanguage = this.languageService.getLanguage();
    this.isTimerEnabled = this.gameService.getTimerState();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleMusic(): void {
    this.isMusicPlaying = this.soundService.toggleMusic();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectLanguage(language: LanguageInterface) {
    this.selectedLanguage = language;
    this.dropdownOpen = false;
    this.languageService.setLanguage(language);
  }

  toggleTimer() {
    if (isPlatformBrowser(this.platformId)) {
      this.isTimerEnabled = this.gameService.toggleTimer();
    }
  }
}
