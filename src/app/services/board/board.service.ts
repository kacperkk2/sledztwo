import { Injectable, OnInit } from '@angular/core';
import { Board, Card, CardCategory, ConfigCard } from 'src/app/components/board/board.component';
import { CONFIG } from 'src/app/app.properties';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private allCards: CardsPool;
  private cardsPool: CardsPool;
  private currentBoard: Board;

  constructor() {
  }

  buildRandomBoard(): Card[] {
    this.initCardsPools();
    this.currentBoard = {
      causers: this.getRandomNCards(this.cardsPool.personMap, CONFIG.CARDS_IN_ROW),
      places: this.getRandomNCards(this.cardsPool.placeMap, CONFIG.CARDS_IN_ROW),
      items: this.getRandomNCards(this.cardsPool.itemMap, CONFIG.CARDS_IN_ROW),
      victims: this.getRandomNCards(this.cardsPool.personMap, CONFIG.CARDS_IN_ROW),
      motives: this.getRandomNCards(this.cardsPool.motivesMap, CONFIG.CARDS_IN_ROW),
    }
    return this.getAllCards();
  }

  buildBoardFromCode(code: string): Card[] {
    this.validateCode(code);
    const boardCode: BoardCode = this.toBoardCode(code);
    this.initCardsPools();
    this.currentBoard = {
      causers: this.loadCards(this.allCards.personMap, this.cardsPool.personMap, boardCode.causersCodes),
      places: this.loadCards(this.allCards.placeMap, this.cardsPool.placeMap, boardCode.placesCodes),
      items: this.loadCards(this.allCards.itemMap, this.cardsPool.itemMap, boardCode.itemsCodes),
      victims: this.loadCards(this.allCards.personMap, this.cardsPool.personMap, boardCode.victimsCodes),
      motives: this.loadCards(this.allCards.motivesMap, this.cardsPool.motivesMap, boardCode.motivesCodes),
    }
    return this.getAllCards();
  }

  swapCards(card: Card, pickedCard: any) {
    let map: Map<string, Card>;
    if (card.category == CardCategory.PERSON) {
      map = this.cardsPool.personMap;
      const index = this.currentBoard.victims.findIndex(c => c.code == card.code);
      if (index > -1) {
        this.currentBoard.victims[index] = pickedCard;
      }
      else {
        const index = this.currentBoard.causers.findIndex(c => c.code == card.code);
        this.currentBoard.causers[index] = pickedCard;
      }
    }
    else if (card.category == CardCategory.ITEM) {
      map = this.cardsPool.itemMap;
      const index = this.currentBoard.items.findIndex(c => c.code == card.code);
      this.currentBoard.items[index] = pickedCard;
    }
    else if (card.category == CardCategory.MOTIVE) {
      map = this.cardsPool.motivesMap;
      const index = this.currentBoard.motives.findIndex(c => c.code == card.code);
      this.currentBoard.motives[index] = pickedCard;
    }
    else if (card.category == CardCategory.PLACE) {
      map = this.cardsPool.placeMap;
      const index = this.currentBoard.places.findIndex(c => c.code == card.code);
      this.currentBoard.places[index] = pickedCard;
    }
    else {
      throw new Error('Invalid card category: ' + card);
    }

    map.delete(pickedCard.code);
    map.set(card.code, card);
  }
  
  getBoardCode() {
    let code: string = '';
    this.currentBoard.causers.forEach(card => code = code + card.code);
    this.currentBoard.places.forEach(card => code = code + card.code);
    this.currentBoard.items.forEach(card => code = code + card.code);
    this.currentBoard.victims.forEach(card => code = code + card.code);
    this.currentBoard.motives.forEach(card => code = code + card.code);
    return code;
  }

  loadCards(allCardsMap: Map<string, Card>, map: Map<string, Card>, cardCodes: string[]): Card[] {
    const cards: Card[] = [];
    cardCodes.forEach(code => {
      cards.push(allCardsMap.get(code)!)
      map.delete(code);
    })
    return cards;
  }

  toBoardCode(code: string): BoardCode {
    const sectionLength = CONFIG.CARDS_IN_ROW * CONFIG.CARD_CODE_LENGTH;
    return {
      causersCodes: this.getCodesFromSection(code.substring(0, sectionLength)),
      placesCodes: this.getCodesFromSection(code.substring(sectionLength, 2 * sectionLength)),
      itemsCodes: this.getCodesFromSection(code.substring(2 * sectionLength, 3 * sectionLength)),
      victimsCodes: this.getCodesFromSection(code.substring(3 * sectionLength, 4 * sectionLength)),
      motivesCodes: this.getCodesFromSection(code.substring(4 * sectionLength, 5 * sectionLength)),
    }
  }

  getCodesFromSection(sectionCode: string): string[] {
    const result: string[] = [];
    for (let i = 0; i < sectionCode.length; i += CONFIG.CARD_CODE_LENGTH) {
        result.push(sectionCode.substring(i, i + CONFIG.CARD_CODE_LENGTH));
    }
    return result;
  }

  validateCode(code: string) {
    if (code.length != CONFIG.CARDS_IN_ROW * CONFIG.ROWS * CONFIG.CARD_CODE_LENGTH) {
      throw new Error('Code is invalid: ' + code);
    }
  }

  initCardsPools() {
    this.cardsPool = {
      personMap: this.buildWithCodes(CONFIG.PERSON, CardCategory.PERSON),
      placeMap: this.buildWithCodes(CONFIG.PLACE, CardCategory.PLACE),
      itemMap: this.buildWithCodes(CONFIG.ITEM, CardCategory.ITEM),
      motivesMap: this.buildWithCodes(CONFIG.MOTIVE, CardCategory.MOTIVE),
    }
    this.allCards = {
      personMap: this.buildWithCodes(CONFIG.PERSON, CardCategory.PERSON),
      placeMap: this.buildWithCodes(CONFIG.PLACE, CardCategory.PLACE),
      itemMap: this.buildWithCodes(CONFIG.ITEM, CardCategory.ITEM),
      motivesMap: this.buildWithCodes(CONFIG.MOTIVE, CardCategory.MOTIVE),
    }
  }

  public getAllCards(): Card[] {
    return [
      ...this.currentBoard.causers, 
      ...this.currentBoard.places, 
      ...this.currentBoard.items, 
      ...this.currentBoard.victims, 
      ...this.currentBoard.motives, 
    ]
  }

  public getRestCards(card: Card): Card[] {
    if (card.category == CardCategory.PERSON) {
      return Array.from(this.cardsPool.personMap.values())
    }
    else if (card.category == CardCategory.ITEM) {
      return Array.from(this.cardsPool.itemMap.values())
    }
    else if (card.category == CardCategory.MOTIVE) {
      return Array.from(this.cardsPool.motivesMap.values())
    }
    else if (card.category == CardCategory.PLACE) {
      return Array.from(this.cardsPool.placeMap.values())
    }
    else {
      throw new Error('Invalid card category: ' + card);
    }
  }

  buildWithCodes(configCards: ConfigCard[], cardCategory: CardCategory): Map<string, Card> {
    const cardsMap = new Map<string, Card>();
    configCards.forEach((configCard, index) => {
      const code = this.getCode(index);
      const card = {
        name: configCard.name,
        image: configCard.image,
        code: code,
        isMarked: false,
        category: cardCategory,
      };
      cardsMap.set(code, card);
    });
    return cardsMap;
  }

  getCode(index: number): string {
    let stringIndex: string = index.toString();
    while (stringIndex.length < CONFIG.CARD_CODE_LENGTH) {
      stringIndex = "0" + stringIndex;
    }
    return stringIndex;
  }

  getRandomNCards(map: Map<string, Card>, n: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < n; i++) {
      cards.push(this.getRandomCard(map));
    }
    return cards;
  }

  getRandomCard(map: Map<string, Card>): Card {
    const entries = Array.from(map.entries());
    const randomIndex = Math.floor(Math.random() * entries.length);
    const [randomCode, randomCard] = entries[randomIndex];
    map.delete(randomCode);
    return randomCard;
  }
}

export interface CardsPool {
  personMap: Map<string, Card>,
  placeMap: Map<string, Card>,
  itemMap: Map<string, Card>,
  motivesMap: Map<string, Card>,
}

export interface BoardCode {
  causersCodes: string[];
  placesCodes: string[];
  itemsCodes: string[];
  victimsCodes: string[];
  motivesCodes: string[];
}