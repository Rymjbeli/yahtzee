import { Component } from '@angular/core';
import { SmallNavbarComponent } from '../small/small-navbar.component';
import { SettingsNavBarComponent } from '../settings/settings-navbar.component';
import { ButtonSecondaryComponent } from '../../buttons/button-secondary/button-secondary.component';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [SmallNavbarComponent, ButtonSecondaryComponent],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
})
export class MainNavbarComponent {}
