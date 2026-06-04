import { Component, inject, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-header',
  imports: [TitleCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  boardsService = inject(BoardsService);

  boardName = computed(() => {
    const active = this.boardsService.activeBoard();
    return active ? active.name : '';
  });
}
