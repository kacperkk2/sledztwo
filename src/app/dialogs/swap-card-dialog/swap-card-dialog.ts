import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Card } from 'src/app/components/board/board.component';
import { BoardService } from 'src/app/services/board/board.service';

@Component({
  selector: 'swap-card-dialog',
  templateUrl: 'swap-card-dialog.html',
  styleUrls: ['./swap-card-dialog.scss'],
})
export class SwapCardDialog {
  
  pickedCard: Card;
  restCards: Card[];

  constructor(
    public dialogRef: MatDialogRef<SwapCardDialog>,
    @Inject(MAT_DIALOG_DATA) public card: Card,
    private boardService: BoardService) {
    }

  ngOnInit(): void {
    this.restCards = this.boardService.getRestCards(this.card);
  }

  picked(card: Card) {
    this.pickedCard = card;
  }

  onSwap() {
    this.dialogRef.close(this.pickedCard);
  }
}