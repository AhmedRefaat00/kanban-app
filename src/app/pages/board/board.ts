import { Component, computed, effect, input, inject, signal } from '@angular/core';
import { BoardsService } from '../../services/boards.service';
import { TaskCard } from '../../components/task-card/task-card';
import { AddNewColumnCard } from "../../components/add-new-column-card/add-new-column-card";
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  imports: [TaskCard, AddNewColumnCard, DragDropModule],
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

  activeTaskId = signal<number | null>(null);

  constructor() {
    effect(() => {
      const boardId = Number(this.id());
      this.boardsService.activeBoardId.set(boardId > 0 ? boardId : null);
    }, { allowSignalWrites: true });
  }

  toggleActiveTask(id: number) {
    this.activeTaskId.set(
      this.activeTaskId() === id ? null : id
    );
  }

  drop(event: CdkDragDrop<any[]>, columnName: string) {
    const activeB = this.board();
    if (!activeB) return;

    this.boardsService.moveTask(
      activeB.id,
      event.previousContainer.id,
      event.container.id,
      event.previousIndex,
      event.currentIndex
    );
  }
}
