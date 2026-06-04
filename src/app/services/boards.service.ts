import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:3000/boards';

  getBoards() {
    return this.http.get(this.baseUrl);
  }

  getBoard(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createBoard(board: any) {
    return this.http.post(this.baseUrl, board);
  }
}
