import { Routes } from '@angular/router';
import { LayoutMainGameComponent } from './layout-main-game.component';
import { GameBoardComponent } from '../../pages/game-board/game-board.component';

export const MainGameRoutes: Routes = [
  {
    path: '',
    component: LayoutMainGameComponent,
    children: [
      {
        path: 'gameboard',
        component: GameBoardComponent,
      },
      // {
        // path: 'game-rules',
        // component: GameRulesComponent,
      // }
    ]
  }
];
