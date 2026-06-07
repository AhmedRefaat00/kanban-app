import { Component, inject, computed, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BoardsService } from '../../services/boards.service';
import { AddNewTaskCard } from '../../components/add-new-task-card/add-new-task-card';
import { AddNewBoardCard } from '../../components/add-new-board-card/add-new-board-card';

@Component({
  selector: 'app-header',
  imports: [TitleCasePipe, AddNewTaskCard, AddNewBoardCard],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  boardsService = inject(BoardsService);
  router = inject(Router);
  
  isAddNewTaskClicked = signal(false);
  isDropdownOpen = signal(false);
  isEditBoardClicked = signal(false);

  boardName = computed(() => {
    const active = this.boardsService.activeBoard();
    return active ? active.name : '';
  });

  hasColumns = computed(() => {
    const active = this.boardsService.activeBoard();
    return !!(active && active.columns && active.columns.length > 0);
  });

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  onEditBoard() {
    this.isDropdownOpen.set(false);
    this.isEditBoardClicked.set(true);
  }

  onDeleteBoard() {
    this.isDropdownOpen.set(false);
    const active = this.boardsService.activeBoard();
    if (!active) return;
    
    if (confirm(`Are you sure you want to delete the board "${active.name}"? This will delete all its columns and tasks.`)) {
      this.boardsService.deleteBoard(active.id);
      this.router.navigate(['/']);
    }
  }
}
