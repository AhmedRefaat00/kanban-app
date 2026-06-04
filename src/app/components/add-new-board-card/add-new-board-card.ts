import { Component, output, signal, inject } from '@angular/core';
import { BoardsService } from '../../services/boards.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-board-card',
  imports: [],
  templateUrl: './add-new-board-card.html',
  styleUrl: './add-new-board-card.css',
})
export class AddNewBoardCard {
  boardsService = inject(BoardsService);
  router = inject(Router);

  close = output<void>();
  boardName = signal('');
  columns = signal<string[]>(['Todo', 'Doing']);

  addColumn() {
    this.columns.update(cols => [...cols, '']);
  }

  removeColumn(index: number) {
    this.columns.update(cols => cols.filter((_, i) => i !== index));
  }

  updateColumn(index: number, value: string) {
    this.columns.update(cols => {
      const newCols = [...cols];
      newCols[index] = value;
      return newCols;
    });
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.close.emit();
    }
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const name = this.boardName().trim();
    if (!name) return;

    const columnsData = this.columns()
      .map(c => c.trim())
      .filter(c => c !== '')
      .map(c => ({ name: c, tasks: [] }));

    const newBoard = this.boardsService.createBoard({
      name,
      columns: columnsData
    });

    this.close.emit();
    this.router.navigate(['/board', newBoard.id]);
  }
}

