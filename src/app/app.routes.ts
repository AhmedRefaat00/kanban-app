import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { Board } from './pages/board/board';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'board/:id', component: Board,  }
];
