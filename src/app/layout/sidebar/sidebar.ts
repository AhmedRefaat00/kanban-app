import { Component, input, inject } from '@angular/core';
import { BoardBtn } from '../../components/board-btn/board-btn';
import { UpperCasePipe } from '@angular/common';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-sidebar',
  imports: [UpperCasePipe, BoardBtn],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  logo = input('');

  boardsService = inject(BoardsService);
  boards = this.boardsService.boards;

  onCreateNewBoard() {
    const name = prompt('Enter new board name:');
    if (name && name.trim()) {
      this.boardsService.createBoard({
        name: name.trim(),
        columns: []
      });
    }
  }
}
