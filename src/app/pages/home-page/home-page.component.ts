import { Component } from '@angular/core';
import { ButtonSecondaryComponent } from '../../shared/components/buttons/button-secondary/button-secondary.component';
import { ButtonPrimaryComponent } from '../../shared/components/buttons/button-primary/button-primary.component';
import { LargeLoaderComponent } from '../../shared/components/loaders/large-loader/large-loader.component';
import {
  DropdownComponent,
  Option,
} from '../../shared/components/dropdown/dropdown.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SettingsNavBarComponent } from '../../shared/components/navbar/settings/settings-navbar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ButtonPrimaryComponent,
    LargeLoaderComponent,
    DropdownComponent,
    InputComponent,
    SettingsNavBarComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  step: number = 1;
  onlineOption: 'create' | 'join' | null = null;
  playerName = 'Player 1';
  playerTwoName = 'Player 2';
  gameMode: 'online' | 'local' | null = null;
  // roomCode : generated 8 character code
  roomCode = Math.random().toString(36).substring(2, 10);
  nextStep() {
    if (this.step === 3 && this.onlineOption === 'join') {
      this.roomCode = '';
    }
    this.step++;
  }
  options: Option[] = [
    { value: 'create', label: 'Create a new room' },
    { value: 'join', label: 'Join an existing room' },
  ];
  selectedOption: Option | null = null;
  playOnline($event: Option) {
    this.gameMode = 'online';
    this.onlineOption = $event.value as 'create' | 'join';
    this.nextStep();
  }
  playLocally() {
    this.gameMode = 'local';
    this.nextStep();
  }
  skipName(step: number) {
    if (step === 1) {
      this.playerName = 'Player 1';
    }
    if (step === 2) {
      this.playerTwoName = 'Player 2';
    }
    this.nextStep();
  }
}
