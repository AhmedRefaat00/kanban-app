import { Component, inject, computed, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BoardsService } from '../../services/boards.service';
import { AddNewTaskCard } from '../../components/add-new-task-card/add-new-task-card';

@Component({
  selector: 'app-header',
  imports: [TitleCasePipe, AddNewTaskCard],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  boardsService = inject(BoardsService);
  isAddNewTaskClicked = signal(false);

  boardName = computed(() => {
    const active = this.boardsService.activeBoard();
    return active ? active.name : '';
  });
}
