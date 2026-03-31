import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Card } from '../board/board.component';
import { BoardService } from '../../services/board/board.service';
import { CONFIG } from '../../app.properties';

@Component({
  selector: 'app-card-swap-view',
  templateUrl: './card-swap-view.component.html',
  styleUrls: ['./card-swap-view.component.scss']
})
export class CardSwapViewComponent implements OnInit {
  @Input() initialCard: Card;
  @Input() showLabels: boolean = false;
  @Input() zoom: number = 1;
  @Output() swapped = new EventEmitter<void>();

  rowCards: Card[] = [];
  availableCards: Card[] = [];
  selectedCard: Card;
  urlRoot: string = CONFIG.URL_ROOT;

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.selectedCard = this.initialCard;
    this.refresh();
  }

  selectRowCard(card: Card): void {
    this.selectedCard = card;
  }

  pickReplacement(pickedCard: Card): void {
    this.boardService.swapCards(this.selectedCard, pickedCard);
    this.selectedCard = pickedCard;
    this.refresh();
    this.swapped.emit();
  }

  private refresh(): void {
    this.rowCards = this.boardService.getRowForCard(this.selectedCard);
    this.availableCards = this.boardService.getRestCards(this.selectedCard);
  }
}
