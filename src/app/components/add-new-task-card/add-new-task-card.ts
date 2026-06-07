import { Component, output, signal, inject, computed, effect, input } from '@angular/core';
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
  task = input<any | null>(null);
  columnName = input<string | null>(null);

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
      const t = this.task();
      if (t) {
        this.title.set(t.title);
        this.description.set(t.description || '');
        this.status.set(t.status || this.columnName() || '');
        const subs = t.subtasks || [];
        this.subtasks.set(subs.length > 0 ? subs.map((st: any) => st.title) : ['', '']);
      } else {
        // Fallback for creation mode
        const columns = this.activeBoardColumns();
        if (columns.length > 0) {
          this.status.set(columns[0]);
        }
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

    const originalSubtasks = this.task() ? this.task().subtasks || [] : [];
    const subtasksData = this.subtasks()
      .map(st => st.trim())
      .filter(st => st !== '')
      .map((st, idx) => {
        const existing = originalSubtasks.find((orig: any) => orig.title.toLowerCase() === st.toLowerCase());
        if (existing) {
          return { ...existing, title: st };
        } else {
          return { id: idx + 1, title: st, isCompleted: false };
        }
      });

    const isEdit = !!this.task();
    if (isEdit) {
      const taskId = this.task().id;
      const oldCol = this.columnName() || this.task().status || '';
      const newCol = this.status();
      const updatedData = {
        title: titleVal,
        description: this.description().trim(),
        subtasks: subtasksData
      };
      this.boardsService.updateTask(activeB.id, taskId, updatedData, oldCol, newCol);
    } else {
      const currentStatus = this.status();
      const taskData = {
        title: titleVal,
        description: this.description().trim(),
        subtasks: subtasksData
      };
      this.boardsService.addTask(activeB.id, currentStatus, taskData);
    }

    this.close.emit();
  }
}

