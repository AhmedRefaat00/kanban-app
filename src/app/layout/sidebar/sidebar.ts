import { Component, input, inject, signal } from '@angular/core';
import { BoardBtn } from '../../components/board-btn/board-btn';
import { UpperCasePipe, AsyncPipe } from '@angular/common';
import { BoardsService } from '../../services/boards.service';


@Component({
  selector: 'app-sidebar',
  imports: [UpperCasePipe, AsyncPipe, BoardBtn],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  logo = input('');

  boardsService = inject(BoardsService);
  boards = signal([]) as any;


  ngOnInit() {
    this.boardsService.getBoards().subscribe(boards => {
      console.log(boards);
      this.boards.set(boards as any);
    });
  }

  onCreateNewBoard(){
    
    
  }
}
