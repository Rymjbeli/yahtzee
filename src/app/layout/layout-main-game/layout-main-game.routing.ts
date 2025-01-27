import { Routes } from '@angular/router';
import { LayoutMainGameComponent } from './layout-main-game.component';
import { GameBoardComponent } from '../../pages/game-board/game-board.component';
import {GameRulesComponent} from "../../pages/game-rules/game-rules.component";

export const MainGameRoutes: Routes = [
  {
    path: '',
    component: LayoutMainGameComponent,
    children: [
      {
        path: '',
        component: GameBoardComponent,
      },
      {
        path: 'rules',
        component: GameRulesComponent,
      }
    ]
  }
];
