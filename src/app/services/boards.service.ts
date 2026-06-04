import { Injectable, signal, computed } from '@angular/core';
import boardsData from '../../data/data.json';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  boards = signal<any[]>([]);

  activeBoardId = signal<number | null>(null);

  activeBoard = computed(() => {
    const id = this.activeBoardId();
    if (id === null) return null;
    return this.boards().find((b) => b.id === id) || null;
  });

  constructor() {
    this.loadBoards();
  }

  private loadBoards() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('kanban_boards');
      if (saved) {
        try {
          this.boards.set(JSON.parse(saved));
          return;
        } catch (e) {
          console.error('Error parsing boards from localStorage', e);
        }
      }
    }
    // Fallback to data.json
    this.boards.set(boardsData.boards);
    this.saveBoards();
  }

  private saveBoards() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('kanban_boards', JSON.stringify(this.boards()));
    }
  }

  getBoards() {
    return this.boards;
  }

  getBoard(id: number) {
    return this.boards().find((b) => b.id === id) || null;
  }

  createBoard(board: any) {
    const current = this.boards();
    const nextId = current.reduce((max, b) => Math.max(max, b.id), 0) + 1;
    const newBoard = {
      ...board,
      id: nextId,
      columns: board.columns || []
    };
    this.boards.set([...current, newBoard]);
    this.saveBoards();
    return newBoard;
  }

  save() {
    this.boards.set([...this.boards()]);
    this.saveBoards();
  }
}
