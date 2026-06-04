import { Component, computed, effect, input, inject, signal } from '@angular/core';
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
  
  board = computed(() => {
    const boardId = Number(this.id());
    if (!boardId || boardId <= 0) {
      return null;
    }
    return this.boardsService.getBoard(boardId);
  });

  activeTaskTitle = signal<string | null>(null);

  constructor() {
    effect(() => {
      const boardId = Number(this.id());
      this.boardsService.activeBoardId.set(boardId > 0 ? boardId : null);
    }, { allowSignalWrites: true });
  }

  toggleActiveTask(title: string) {
    this.activeTaskTitle.set(
      this.activeTaskTitle() === title ? null : title
    );
  }
}
