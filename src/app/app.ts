import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header } from "./layout/header/header";
import { BoardsService } from './services/boards.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  boardsService = inject(BoardsService);
  logo = computed(() => this.boardsService.isDarkMode() ? 'logo-light.svg' : 'logo-dark.svg');
}
