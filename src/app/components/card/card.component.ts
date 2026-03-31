import { Component, Input } from '@angular/core';
import { Card } from '../board/board.component';
import { CONFIG } from '../../app.properties';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card: Card;
  @Input() showLabel: boolean = false;
  @Input() isMarked: boolean = false;
  @Input() isSelected: boolean = false;
  @Input() switchMark: boolean = false;
  @Input() showBorder: boolean = false;
  @Input() zoom: number = 1;

  urlRoot: string = CONFIG.URL_ROOT;
}
