import { Component, input, inject, signal } from '@angular/core';
import { BoardBtn } from '../../components/board-btn/board-btn';
import { UpperCasePipe } from '@angular/common';
import { BoardsService } from '../../services/boards.service';
import { AddNewBoardCard } from "../../components/add-new-board-card/add-new-board-card";

@Component({
  selector: 'app-sidebar',
  imports: [UpperCasePipe, BoardBtn, AddNewBoardCard],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  logo = input('');
  isCreateNewBoardClicked = signal(false);

  boardsService = inject(BoardsService);
  boards = this.boardsService.boards;


  

}
