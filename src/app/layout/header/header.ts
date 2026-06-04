import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [TitleCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  boardName = 'platform launch';
}
