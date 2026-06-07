import { Component, output, signal, inject, input, effect } from '@angular/core';
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
  boardId = input<number | null>(null);
  
  boardName = signal('');
  columns = signal<{ id?: number; name: string }[]>([
    { name: 'Todo' },
    { name: 'Doing' }
  ]);

  constructor() {
    effect(() => {
      const id = this.boardId();
      if (id) {
        const board = this.boardsService.getBoard(id);
        if (board) {
          this.boardName.set(board.name);
          this.columns.set(
            (board.columns || []).map((c: any) => ({
              id: c.id,
              name: c.name
            }))
          );
        }
      }
    }, { allowSignalWrites: true });
  }

  addColumn() {
    this.columns.update(cols => [...cols, { name: '' }]);
  }

  removeColumn(index: number) {
    this.columns.update(cols => cols.filter((_, i) => i !== index));
  }

  updateColumn(index: number, value: string) {
    this.columns.update(cols => {
      const newCols = [...cols];
      newCols[index] = { ...newCols[index], name: value };
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
      .map(c => ({ id: c.id, name: c.name.trim() }))
      .filter(c => c.name !== '');

    const id = this.boardId();
    if (id) {
      this.boardsService.updateBoard(id, name, columnsData);
      this.close.emit();
    } else {
      const newBoard = this.boardsService.createBoard({
        name,
        columns: columnsData
      });
      this.close.emit();
      this.router.navigate(['/board', newBoard.id]);
    }
  }
}

