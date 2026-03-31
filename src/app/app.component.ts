import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientService } from './http-client.service';
import { BoardService } from './services/board/board.service';
import { CodecService } from './services/codec/codec.service';
import { CONFIG } from './app.properties';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    const allCards = [
      ...CONFIG.PERSON, ...CONFIG.PLACE,
      ...CONFIG.ITEM, ...CONFIG.MOTIVE
    ];

    const preload = () => allCards.forEach(card => {
      const img = new Image();
      img.src = CONFIG.URL_ROOT + card.image;
    });

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preload);
    } else {
      setTimeout(preload, 2000);
    }
  }
}