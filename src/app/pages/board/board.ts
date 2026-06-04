import { Component, effect, input, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { BoardsService } from '../../services/boards.service';
import { TaskCard } from '../../components/task-card/task-card';

@Component({
  selector: 'app-board',
  imports: [TaskCard],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  id = input<number>(0);
  boardsService = inject(BoardsService);
  board = signal<any>(null);
  activeTaskTitle = signal<string | null>(null);

  constructor() {
    effect(() => {
      const boardId = this.id();

      if (!boardId || boardId <= 0) {
        this.board.set(null);
        return;
      }

      this.boardsService
        .getBoard(boardId)
        .pipe(take(1))
        .subscribe((board) => this.board.set(board));
    });
  }

  toggleActiveTask(title: string) {
    this.activeTaskTitle.set(
      this.activeTaskTitle() === title ? null : title
    );
  }





}
