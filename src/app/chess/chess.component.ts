import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {
  brett: string[] = [];
  brettStart: string[] = [
    "sT1", "sP1", "sL1", "sK", "sD", "sL2", "sP2", "sT2",
    "sB1", "sB2", "sB3", "sB4", "sB5", "sB6", "sB7", "sB8",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "wB1", "wB2", "wB3", "wB4", "wB5", "wB6", "wB7", "wB8",
    "wT1", "wP1", "wL1", "wK", "wD", "wL2", "wP2", "wT2"
  ];
  zug: string = "?";
  zuege: string[];
  status: string;
  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.service.getJSON('brett')
      .subscribe(
        ret => this.brett = ret,
        error => console.log(error));
    this.service.getJSON('zuege')
      .subscribe(
        ret => this.zuege = ret,
        error => console.log(error));
  }
  reset(): void {
    this.brett = this.brettStart;
    this.service.putJSON('brett', JSON.stringify(this.brett))
      .subscribe(
        ret => console.log(ret),
        error => console.log(error));
    this.zuege = [];
    this.service.putJSON('zuege', JSON.stringify(this.zuege))
      .subscribe(
        ret => console.log(ret),
        error => console.log(error));
    this.zug = null;
    this.kFrom = null;
    this.kTo = null;
  }
  move(): void {
    let from = ChessComponent.getPos(this.zug);
    if (!from) return;
    let to = ChessComponent.getPos(this.zug.substring(3));
    console.log("to:" + to);
    this.brett[to] = this.brett[from];
    this.brett[from] = "";
    this.service.putJSON('brett', JSON.stringify(this.brett))
      .subscribe(
        ret => this.zuege.push(this.zug),
        error => console.log(error));
    this.service.putJSON('zuege', JSON.stringify(this.zuege))
      .subscribe(
        ret => console.log(ret),
        error => console.log(error));
    this.status = this.kFrom + ':' + from + '-' + this.kTo + ':' + to;
    this.kFrom = this.kTo = null;
  }
  getImage(i: number): string {
    return "assets/koenig.svg";
  }
  static getPos(z: string): number {
    if (!z) return -1;
    z = z.toLowerCase();
    let colA = z.charCodeAt(0) - "a".charCodeAt(0);
    let rowA = z.charCodeAt(1) - "1".charCodeAt(0);
    console.log("colA:" + colA);
    console.log("rowA:" + rowA);
    let from = (8 - rowA) * 8 + colA;
    console.log("from:" + from);
    return from;
  }
  select(i: number) {
    if (this.kFrom == i) {
      this.kFrom = null;
      return;
    }

    if (this.kTo == i) {
      this.kTo = null;
      return;
    }
    if (!this.kFrom) {
      this.kFrom = i;
    } else {
      this.kTo = i;
    }
    this.zugToString();
  }

  zugToString(): void {
    this.zug = ChessComponent.getName(this.kFrom) + '-' + ChessComponent.getName(this.kTo);
  }
  static getName(n: number): string {
    if (n == null) return '?';
    let k = n;
    let col = n % 8;
    let row = 9 - Math.floor(k / 8);
    let c = String.fromCharCode('a'.charCodeAt(0) + col);
    return c + row;
  }
  getColor(i: number): string {
    if (i == this.kFrom) { return 'green' };
    if (i == this.kTo) { return 'orange' };
    let n = Math.floor(i / 8);
    if (n % 2 == 0) {
      if (i % 2 == 0) {
        return '#eeeeee';
      } else {
        return 'black';
      }
    } else {
      if (i % 2 != 0) {
        return '#eeeeee';
      } else {
        return 'black';
      }
    }
    return 'red';
  }
  kFrom: number;
  kTo: number;

  keyPress(event: KeyboardEvent) {
    const inputChar = event.key;
    console.log(event);
    return;
    let s1 = this.zug;
    if (s1.length < 2) {
      s1 += inputChar;
    }
    this.kFrom = ChessComponent.getPos(s1);


    let s2 = this.zug.substring(3);
    if (s2.length < 2) {
      s2 += inputChar;
    }
    this.kTo = ChessComponent.getPos(s2);
  }
}
