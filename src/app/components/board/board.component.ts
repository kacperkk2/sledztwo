import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board/board.service';
import { CONFIG } from '../../app.properties';
import { MatDialog } from '@angular/material/dialog';
import { SwapCardDialog } from 'src/app/dialogs/swap-card-dialog/swap-card-dialog';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  cards: Card[];
  isSwapMode: boolean = false;
  isLabelMode: boolean = false;

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private boardService: BoardService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const code = params['code'];
      // console.log(code)
      if (code) {
        this.cards = this.boardService.buildBoardFromCode(code);
      }
      else {
        this.boardService.buildRandomBoard();
        const code: string = this.boardService.getBoardCode();
        this.router.navigate(['/', code]);
      }
    });
    // this.share();
  }

  share() {
    const url = location.origin + CONFIG.URL_ROOT + "/" + this.boardService.getBoardCode();
    console.log(url)
  }

  reloadRandomBoard() {
    this.boardService.buildRandomBoard();
    const code: string = this.boardService.getBoardCode();
    this.router.navigate(['/', code]);
  }

  swapCard(card: Card) {
    const dialogRef = this.dialog.open(SwapCardDialog, {data: card, width: '90%'});
    dialogRef.afterClosed().subscribe(pickedCard => {
      if (pickedCard) {
        this.boardService.swapCards(card, pickedCard);
        const code: string = this.boardService.getBoardCode();
        this.router.navigate(['/', code]);
      }
    });
  }

  markCard(card: Card) {
    card.isMarked = !card.isMarked;
  }

  swapMode() {
    this.isSwapMode = !this.isSwapMode;
  }

  getCardColor(card: Card) {
    return card.isMarked ? 'RED' : ''
  }

  switchLabels() {
    this.isLabelMode = !this.isLabelMode
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

