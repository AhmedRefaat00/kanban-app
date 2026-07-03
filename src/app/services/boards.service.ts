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

  isDarkMode = signal(false);
  isSidebarHidden = signal(false);

  constructor() {
    this.loadBoards();
    this.loadTheme();
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
    
    // Assign IDs to new columns if they don't have them
    const columns = (board.columns || []).map((col: any, index: number) => ({
      ...col,
      id: col.id || index + 1,
      tasks: col.tasks || []
    }));

    const newBoard = {
      ...board,
      id: nextId,
      columns
    };
    this.boards.set([...current, newBoard]);
    this.saveBoards();
    return newBoard;
  }

  updateBoard(boardId: number, name: string, newColumnsData: { id?: number; name: string }[]) {
    const current = this.boards();
    const board = current.find(b => b.id === boardId);
    if (!board) return;

    board.name = name;

    const existingColsMap = new Map<number, any>();
    if (board.columns) {
      board.columns.forEach((c: any) => {
        if (c.id) {
          existingColsMap.set(c.id, c);
        }
      });
    }

    const nextColId = (board.columns || []).reduce((max: number, c: any) => Math.max(max, c.id || 0), 0) + 1;
    let tempColId = nextColId;

    board.columns = newColumnsData.map(colData => {
      if (colData.id && existingColsMap.has(colData.id)) {
        const existingCol = existingColsMap.get(colData.id);
        const updatedTasks = (existingCol.tasks || []).map((t: any) => ({
          ...t,
          status: colData.name
        }));
        return {
          ...existingCol,
          name: colData.name,
          tasks: updatedTasks
        };
      } else {
        return {
          id: tempColId++,
          name: colData.name,
          tasks: []
        };
      }
    });

    this.boards.set([...current]);
    this.saveBoards();
  }

  deleteBoard(boardId: number) {
    const current = this.boards();
    const filtered = current.filter(b => b.id !== boardId);
    this.boards.set(filtered);
    this.saveBoards();
    if (this.activeBoardId() === boardId) {
      this.activeBoardId.set(filtered.length > 0 ? filtered[0].id : null);
    }
  }

  addColumn(boardId: number, name: string) {
    const current = this.boards();
    const board = current.find(b => b.id === boardId);
    if (board) {
      if (!board.columns) board.columns = [];
      const nextColId = board.columns.reduce((max: number, c: any) => Math.max(max, c.id || 0), 0) + 1;
      board.columns.push({
        id: nextColId,
        name,
        tasks: []
      });
      this.boards.set([...current]);
      this.saveBoards();
    }
  }

  addTask(boardId: number, columnName: string, taskData: any) {
    const current = this.boards();
    const board = current.find(b => b.id === boardId);
    if (board) {
      const column = board.columns.find((c: any) => c.name === columnName);
      if (column) {
        if (!column.tasks) column.tasks = [];
        const nextTaskId = Math.floor(Math.random() * 1000000);
        const newTask = {
          id: nextTaskId,
          title: taskData.title,
          description: taskData.description,
          status: columnName,
          subtasks: taskData.subtasks || []
        };
        column.tasks.push(newTask);
        this.boards.set([...current]);
        this.saveBoards();
        return newTask;
      }
    }
    return null;
  }

  updateTask(boardId: number, taskId: number, updatedData: any, oldColumnName: string, newColumnName: string) {
    const current = this.boards();
    const board = current.find(b => b.id === boardId);
    if (!board) return;

    const oldColumn = board.columns.find((c: any) => c.name === oldColumnName);
    const newColumn = board.columns.find((c: any) => c.name === newColumnName);

    if (!oldColumn || !newColumn) return;

    if (oldColumnName === newColumnName) {
      const taskIdx = oldColumn.tasks.findIndex((t: any) => t.id === taskId);
      if (taskIdx > -1) {
        oldColumn.tasks[taskIdx] = {
          ...oldColumn.tasks[taskIdx],
          ...updatedData,
          status: newColumnName
        };
      }
    } else {
      const taskIdx = oldColumn.tasks.findIndex((t: any) => t.id === taskId);
      if (taskIdx > -1) {
        const [task] = oldColumn.tasks.splice(taskIdx, 1);
        const updatedTask = {
          ...task,
          ...updatedData,
          status: newColumnName
        };
        if (!newColumn.tasks) newColumn.tasks = [];
        newColumn.tasks.push(updatedTask);
      }
    }
    this.boards.set([...current]);
    this.saveBoards();
  }

  deleteTask(boardId: number, columnName: string, taskId: number) {
    const current = this.boards();
    const board = current.find(b => b.id === boardId);
    if (board) {
      const column = board.columns.find((c: any) => c.name === columnName);
      if (column && column.tasks) {
        column.tasks = column.tasks.filter((t: any) => t.id !== taskId);
        this.boards.set([...current]);
        this.saveBoards();
      }
    }
  }

  moveTask(boardId: number, previousColumnName: string, currentColumnName: string, previousIndex: number, currentIndex: number) {
    const current = this.boards();
    const board = current.find(b => b.id === boardId);
    if (!board) return;

    const previousColumn = board.columns.find((c: any) => c.name === previousColumnName);
    const currentColumn = board.columns.find((c: any) => c.name === currentColumnName);

    if (!previousColumn || !currentColumn) return;

    if (previousColumnName === currentColumnName) {
      const tasks = previousColumn.tasks;
      if (tasks && previousIndex > -1 && currentIndex > -1) {
        const [movedTask] = tasks.splice(previousIndex, 1);
        tasks.splice(currentIndex, 0, movedTask);
      }
    } else {
      const previousTasks = previousColumn.tasks || [];
      const currentTasks = currentColumn.tasks || [];
      if (previousIndex > -1) {
        const [movedTask] = previousTasks.splice(previousIndex, 1);
        movedTask.status = currentColumnName;
        currentTasks.splice(currentIndex, 0, movedTask);
      }
    }
    this.boards.set([...current]);
    this.saveBoards();
  }

  save() {
    this.boards.set([...this.boards()]);
    this.saveBoards();
  }

  // --- Theme Management ---
  private loadTheme() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('kanban_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      this.isDarkMode.set(isDark);
      this.applyTheme(isDark);
    }
  }

  toggleTheme() {
    const nextDark = !this.isDarkMode();
    this.isDarkMode.set(nextDark);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('kanban_theme', nextDark ? 'dark' : 'light');
    }
    this.applyTheme(nextDark);
  }

  private applyTheme(isDark: boolean) {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}

