import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {
  brett: string[] = ChessComponent.brettStart;
  static brettStart: string[] = [
    "sT1", "sP1", "sL1", "sD", "sK", "sL2", "sP2", "sT2",
    "sB1", "sB2", "sB3", "sB4", "sB5", "sB6", "sB7", "sB8",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "wB1", "wB2", "wB3", "wB4", "wB5", "wB6", "wB7", "wB8",
    "wT1", "wP1", "wL1", "wD", "wK", "wL2", "wP2", "wT2"
  ];
  zug: string = "?";
  displayedColumns: string[] = ['zug'];

  zuege: string[];
  status: string;
  cellHeight:number;
  constructor(private service: DataService) { }

  ngOnInit(): void {
   let w = Math.min(window.innerWidth,window.innerHeight);
    this.cellHeight = (w*0.9)  / 8;
    console.log(w+">"+window.innerHeight+":"+window.innerWidth);
    this.service.getJSON('brett')
      .subscribe(
        ret => this.brett = ret,
        error => console.log(error));
    this.service.getJSON('zuege')
      .subscribe(
        ret => {this.zuege = ret; this.scrollToBottom('zuege');}
        ,
        error => console.log(error));
  }
 scrollToBottom (id:string) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
 }
  onResize(event: any) {
    this.cellHeight = window.innerWidth / 8;

  }
  getHeight(){
    return this.cellHeight*8+'px';
  }
  reset(): void {
    this.brett = ChessComponent.brettStart;
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
    this.status = 'White';
  }
  move(): void {
    let from = this.kFrom;
    if (from == null) return;
    let to = this.kTo;//ChessComponent.getPos(this.zug.substring(3));
    if (to == null) return;
    console.log("to:" + to);
    this.brett[to] = this.brett[from];
    this.brett[from] = "";
    this.service.putJSON('brett', JSON.stringify(this.brett))
      .subscribe(
        ret => this.addZug(this.zug),
        error => console.log(error));

    this.kFrom = this.kTo = null;
  }
  addZug(zug: string): void {
    this.zuege.push(this.zug);

    const z  = Object.assign([], this.zuege);
    this.zuege=z;
    this.scrollToBottom('zuege');
    if (this.zuege.length %2 ==1){
      this.status='schwarz';
    }else{
      this.status = 'weiß';
    }
    this.service.putJSON('zuege', JSON.stringify(this.zuege))
      .subscribe(
        ret => console.log(ret),
        error => console.log(error));
  }
  getImage(i: number): string {
    let name = this.brett[i];
    if (name && name.length > 2) {
      name = name.substring(0, 2);
    }
    return "./assets/" + name + ".svg";
  }
  // static getPos(z: string): number {
  //   if (!z) return -1;
  //   z = z.toLowerCase();
  //   let colA = z.charCodeAt(0) - "a".charCodeAt(0);
  //   let rowA = z.charCodeAt(1) - "1".charCodeAt(0);
  //   console.log("colA:" + colA);
  //   console.log("rowA:" + rowA);
  //   let from = (8 - rowA) * 8 + colA;
  //   console.log("from:" + from);
  //   return from;
  // }
  select(i: number) {

    console.log(i);
    if (this.kFrom == i) {
      this.kFrom = null;
      return;
    }

    if (this.kTo == i) {
      this.kTo = null;
      return;
    }
    if (this.kFrom==null) {
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
    let row = 8 - Math.floor(k / 8);
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
        return 'blue';
      }
    } else {
      if (i % 2 != 0) {
        return '#eeeeee';
      } else {
        return 'blue';
      }
    }
    return 'red';
  }
  kFrom: number;
  kTo: number;


}
