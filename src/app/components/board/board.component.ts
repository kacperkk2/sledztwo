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
  swapViewCard: Card | null = null;
  urlRoot: string = CONFIG.URL_ROOT;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService) { }

  ngOnInit() {
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
  }

  zoomIn() {
    this.zoom = Math.min(1.2, +(this.zoom + 0.05).toFixed(2));
  }

  zoomOut() {
    this.zoom = Math.max(0.8, +(this.zoom - 0.05).toFixed(2));
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
