import { Component, output, signal, inject, computed, effect } from '@angular/core';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-add-new-task-card',
  imports: [],
  templateUrl: './add-new-task-card.html',
  styleUrl: './add-new-task-card.css',
})
export class AddNewTaskCard {
  boardsService = inject(BoardsService);

  close = output<void>();
  title = signal('');
  description = signal('');
  status = signal('');
  subtasks = signal<string[]>(['', '']);

  activeBoardColumns = computed(() => {
    const activeB = this.boardsService.activeBoard();
    return activeB ? activeB.columns.map((c: any) => c.name) : ['Todo', 'Doing', 'Done'];
  });

  constructor() {
    effect(() => {
      const columns = this.activeBoardColumns();
      if (columns.length > 0) {
        this.status.set(columns[0]);
      }
    }, { allowSignalWrites: true });
  }

  addSubtask() {
    this.subtasks.update(subs => [...subs, '']);
  }

  removeSubtask(index: number) {
    this.subtasks.update(subs => subs.filter((_, i) => i !== index));
  }

  updateSubtask(index: number, value: string) {
    this.subtasks.update(subs => {
      const newSubs = [...subs];
      newSubs[index] = value;
      return newSubs;
    });
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.close.emit();
    }
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const titleVal = this.title().trim();
    if (!titleVal) return;

    const activeB = this.boardsService.activeBoard();
    if (!activeB) return;

    const currentStatus = this.status();
    const column = activeB.columns.find((c: any) => c.name === currentStatus);
    if (!column) return;

    const subtasksData = this.subtasks()
      .map(st => st.trim())
      .filter(st => st !== '')
      .map((st, idx) => ({ title: st, isCompleted: false, id: idx + 1 }));

    if (!column.tasks) {
      column.tasks = [];
    }

    const newTask = {
      title: titleVal,
      description: this.description().trim(),
      status: column.name,
      subtasks: subtasksData,
      id: Math.floor(Math.random() * 1000000)
    };

    column.tasks.push(newTask);
    this.boardsService.save();

    this.close.emit();
  }
}

