import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { input } from '@angular/core';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-board-btn',
  imports: [RouterLink],
  templateUrl: './board-btn.html',
  styleUrl: './board-btn.css',
})
export class BoardBtn {
  board = input({} as any);
  boardsService = inject(BoardsService);

  isActive = computed(() => {
    return this.boardsService.activeBoardId() === this.board().id;
  });

  onClick() {
    // console.log(this.board());
  }
}
