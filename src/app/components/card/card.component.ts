import { Component, HostBinding, Input } from '@angular/core';
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
  @Input() fillHeight: boolean = false;
  @Input() zoom: number = 1;

  @HostBinding('style.height') get hostHeight() { return this.fillHeight ? '100%' : 'auto'; }

  urlRoot: string = CONFIG.URL_ROOT;
}
