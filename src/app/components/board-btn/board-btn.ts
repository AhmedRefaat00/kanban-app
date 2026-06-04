import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { input } from '@angular/core';

@Component({
  selector: 'app-board-btn',
  imports: [RouterLink],
  templateUrl: './board-btn.html',
  styleUrl: './board-btn.css',
})
export class BoardBtn {
  board = input({} as any);

  isActive = false;
  onClick() {
    // console.log(this.board());
  }
}
