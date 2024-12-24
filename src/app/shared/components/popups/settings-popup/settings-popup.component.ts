import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {isPlatformBrowser, NgClass, NgOptimizedImage} from "@angular/common";
import {ButtonPrimaryComponent} from "../../buttons/button-primary/button-primary.component";
import {SoundService} from "../../../services/settings/sound.service";
import {FormsModule} from "@angular/forms";
import {CONSTANTS} from "../../../../../config/const.config";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {LanguageService} from "../../../services/settings/language.service";
import {LanguageInterface} from "../../../interfaces/language.interface";

@Component({
  selector: 'app-settings-popup',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ButtonPrimaryComponent,
    FormsModule,
    MatFormField,
    MatSelect,
    MatOption,
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

  isMusicPlaying = false;
  languages: LanguageInterface[] = [];
  selectedLanguage: LanguageInterface = { name: CONSTANTS.LANGUAGES.ENGLISH, code: CONSTANTS.LANGUAGES.EN };
  dropdownOpen: boolean = false;
  ngOnInit(): void {
    this.isMusicPlaying = this.soundService.getMusicState();
    this.languages = this.languageService.languages;
    this.selectedLanguage = this.languageService.getLanguage();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleMusic(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMusicPlaying = this.soundService.toggleMusic();
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectLanguage(language: LanguageInterface) {
    this.selectedLanguage = language;
    this.dropdownOpen = false;
    this.languageService.setLanguage(language);
  }
}
