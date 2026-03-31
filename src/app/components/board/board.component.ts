import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board/board.service';
import { CONFIG } from '../../app.properties';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  cards: Card[];
  isSwapMode: boolean = false;
  isLabelMode: boolean = false;
  zoom: number = 1;

  private static readonly LS_KEY = 'kacperkk2.sledztwo';
  swapViewCard: Card | null = null;
  urlRoot: string = CONFIG.URL_ROOT;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService) { }

  ngOnInit() {
    const settings = JSON.parse(localStorage.getItem(BoardComponent.LS_KEY) ?? '{}');
    this.zoom = typeof settings.zoom === 'number' ? settings.zoom : 1;
    this.isLabelMode = typeof settings.labels === 'boolean' ? settings.labels : false;

    this.route.params.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.cards = this.boardService.buildBoardFromCode(code);
      }
      else {
        this.boardService.buildRandomBoard();
        const code: string = this.boardService.getBoardCode();
        this.router.navigate(['/', code]);
      }
    });
  }

  reloadRandomBoard() {
    this.boardService.buildRandomBoard();
    const code: string = this.boardService.getBoardCode();
    this.router.navigate(['/', code]);
  }

  enterSwapView(card: Card) {
    this.swapViewCard = card;
  }

  onSwapped() {
    this.cards = this.boardService.getAllCards();
  }

  onBack() {
    this.swapViewCard = null;
    const code = this.boardService.getBoardCode();
    this.router.navigate(['/', code]);
  }

  markCard(card: Card) {
    card.isMarked = !card.isMarked;
  }

  swapMode() {
    this.isSwapMode = !this.isSwapMode;
  }

  switchLabels() {
    this.isLabelMode = !this.isLabelMode;
    this.saveSettings();
  }

  zoomIn() {
    this.zoom = Math.min(1.2, +(this.zoom + 0.05).toFixed(2));
    this.saveSettings();
  }

  zoomOut() {
    this.zoom = Math.max(0.9, +(this.zoom - 0.05).toFixed(2));
    this.saveSettings();
  }

  private saveSettings() {
    localStorage.setItem(BoardComponent.LS_KEY, JSON.stringify({ zoom: this.zoom, labels: this.isLabelMode }));
  }
}

export interface Card {
  name: string;
  image: string;
  code: string;
  isMarked: boolean;
  category: CardCategory;
}

export enum CardCategory {
  PERSON, ITEM, PLACE, MOTIVE
}

export interface ConfigCard {
  name: string;
  image: string;
}

export interface Board {
  causers: Card[];
  places: Card[];
  items: Card[];
  victims: Card[];
  motives: Card[];
}
