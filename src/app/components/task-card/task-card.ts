import { Component, inject, input, output } from '@angular/core';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  task = input<any>();
  closeClicked = output<void>();
  boardService = inject(BoardsService);

  closeCard() {
    this.closeClicked.emit();
  }

  toggleSubtask(subtask: any) {
    subtask.isCompleted = !subtask.isCompleted;
    this.boardService.save();
  }

}
