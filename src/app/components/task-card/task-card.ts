import { Component, inject, input, output, signal, computed } from '@angular/core';
import { BoardsService } from '../../services/boards.service';
import { AddNewTaskCard } from '../add-new-task-card/add-new-task-card';

@Component({
  selector: 'app-task-card',
  imports: [AddNewTaskCard],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  task = input<any>();
  columnName = input<string>('');
  closeClicked = output<void>();
  
  boardService = inject(BoardsService);

  isDropdownOpen = signal(false);
  isEditTaskClicked = signal(false);

  activeBoardColumns = computed(() => {
    const activeB = this.boardService.activeBoard();
    return activeB ? activeB.columns.map((c: any) => c.name) : [];
  });

  closeCard() {
    this.closeClicked.emit();
  }

  toggleSubtask(subtask: any) {
    subtask.isCompleted = !subtask.isCompleted;
    this.boardService.save();
  }

  onStatusChange(newStatus: string) {
    const activeB = this.boardService.activeBoard();
    if (!activeB) return;
    this.boardService.updateTask(activeB.id, this.task().id, {}, this.columnName(), newStatus);
    this.closeCard();
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  onEditTask() {
    this.isDropdownOpen.set(false);
    this.isEditTaskClicked.set(true);
  }

  onDeleteTask() {
    this.isDropdownOpen.set(false);
    const activeB = this.boardService.activeBoard();
    if (!activeB) return;
    
    if (confirm(`Are you sure you want to delete the task "${this.task().title}"?`)) {
      this.boardService.deleteTask(activeB.id, this.columnName(), this.task().id);
      this.closeCard();
    }
  }
}
