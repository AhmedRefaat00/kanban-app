import { Component, computed, effect, input, inject, signal } from '@angular/core';
import { BoardsService } from '../../services/boards.service';
import { TaskCard } from '../../components/task-card/task-card';
import { AddNewBoardCard } from "../../components/add-new-board-card/add-new-board-card";
import { AddNewColumnCard } from "../../components/add-new-column-card/add-new-column-card";

@Component({
  selector: 'app-board',
  imports: [TaskCard, AddNewBoardCard, AddNewColumnCard],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  id = input<number>(0);
  boardsService = inject(BoardsService);
  isAddNewColumnClicked = signal(false);

  
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
