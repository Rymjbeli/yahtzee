import { Component } from '@angular/core';
import { MainNavbarComponent } from "../../shared/components/navbar/main/main-navbar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout-main-game',
  standalone: true,
  imports: [MainNavbarComponent, RouterModule],
  templateUrl: './layout-main-game.component.html',
  styleUrl: './layout-main-game.component.scss',
})
export class LayoutMainGameComponent {

}
