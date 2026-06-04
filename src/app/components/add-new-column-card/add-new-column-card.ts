import { Component, output, signal, inject } from '@angular/core';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-add-new-column-card',
  imports: [],
  templateUrl: './add-new-column-card.html',
  styleUrl: './add-new-column-card.css',
})
export class AddNewColumnCard {
  boardsService = inject(BoardsService);

  close = output<void>();
  columnName = signal('');

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.close.emit();
    }
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const name = this.columnName().trim();
    if (!name) return;

    const activeB = this.boardsService.activeBoard();
    if (activeB) {
      if (!activeB.columns) {
        activeB.columns = [];
      }
      const exists = activeB.columns.some((c: any) => c.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        alert('A column with this name already exists.');
        return;
      }
      activeB.columns.push({
        name,
        tasks: []
      });
      this.boardsService.save();
    }

    this.close.emit();
  }
}
