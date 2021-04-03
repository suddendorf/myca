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
  cellHeight: number;
  myColor: string;
  canMove = true;
  interval: any;
  rotate=false;
  vBrett: string[];
  constructor(private service: DataService) { }

  ngOnInit(): void {
    let w = Math.min(window.innerWidth, window.innerHeight);
    this.cellHeight = (w * 0.5) / 8;
    console.log(w + ">" + window.innerHeight + ":" + window.innerWidth);
    this.interval = setInterval(() => {
      this.read();
    }, 1000 * 1);
  }

  read() {
    console.log('read');
    this.service.getJSON('color')
      .subscribe(
        color => this.readDetails(color),
        error => console.log(error));
  }
  readDetails(color: string) {
    console.log('my'+this.myColor+' color:'+color);
    if (color == 'white') {
      this.status = 'black';
    } else {
      this.status = 'white';
    }

    if (this.myColor != color) {
      if ( this.myColor){
        clearInterval(this.interval);
      }
      this.canMove = true;
      this.service.getJSON('brett')
        .subscribe(
          ret => this.setBrett(ret),
          error => console.log(error));
      this.service.getJSON('zuege')
        .subscribe(
          ret => { this.zuege = ret; this.scrollToBottom('zuege'); }
          ,
          error => console.log(error));
    }
  }
  setBrett(brett: string []): void {
    this.brett = brett;
    this.vBrett =brett;
    if (this.rotate){
      for ( let i = 0;i<brett.length;i++){
    //    this.vBrett[63-i]=this.brett[i];
      }
    }
  }

  scrollToBottom(id: string) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
  }
  onResize(event: any) {
    this.cellHeight = window.innerWidth*0.5 / 8;

  }
  getHeight() {
    return this.cellHeight * 8 + 'px';
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

    this.service.putJSON('color', JSON.stringify('none'))
      .subscribe(
        ret => console.log(ret),
        error => console.log(error));
    this.zug = null;
    this.kFrom = null;
    this.kTo = null;
    this.myColor = null;
    this.canMove = true;
    this.rotate = false;
    this.vBrett = this.brett;
  }
  move(): void {
    let from = this.kFrom;
    if (from == null) return;
    let to = this.kTo;//ChessComponent.getPos(this.zug.substring(3));
    if (to == null) return;
    console.log("to:" + to);
    this.moveWithRule(from,to);
    this.service.putJSON('brett', JSON.stringify(this.brett))
      .subscribe(
        ret => this.addZug(this.zug),
        error => console.log(error));
    this.kFrom = this.kTo = null;
    this.canMove = false;
    this.interval = setInterval(() => {
      this.read();
    }, 1000 * 1);

  }
  moveWithRule(from:number,to:number) {
    const figur= this.brett[from];
    const row = Math.floor(to/8);
    //rochade
    if ( figur.substring(0,2) == 'wK' && from ==60){
      this.brett[to] = this.brett[from];
      this.brett[from] = "";
      if ( to == 62){
        this.brett[61] = 'wT2';
        this.brett[63] = "";
        return;
      }
      if ( to == 58){
        this.brett[59] = 'wT1';
        this.brett[56] = "";
        return;
      }
    }

    if ( figur.substring(0,2) == 'sK' && from ==4){
      this.brett[to] = this.brett[from];
      this.brett[from] = "";
      if ( to == 6){
        this.brett[5] = 'sT2';
        this.brett[7] = "";
        return;
      }
      if ( to == 2){
        this.brett[3] = 'sT1';
        this.brett[0] = "";
        return;
      }
    }
    //Bauerntausch
    if ( figur.substring(0,2) == 'wB'){
      if ( row==0){
        this.brett[to] = 'wD';
        this.brett[from] = "";
        return;
      }
    }
    if ( figur.substring(0,2) == 'sB'){
      if ( row==7){
        this.brett[to] = 'sD';
        this.brett[from] = "";
        return;
      }
    }
    // Standard
    this.brett[to] = this.brett[from];
    this.brett[from] = "";

  }
  addZug(zug: string): void {
    if (this.zuege == null) {
      this.zuege = [];
    }
    console.log(this.myColor);
    if (this.zuege.length==0  ) {
      this.myColor = 'white';
    } else if (this.zuege.length == 1) {
      this.myColor = 'black';
    }
    this.zuege.push(this.zug);

    const z = Object.assign([], this.zuege);
    this.zuege = z;
    this.scrollToBottom('zuege');
    this.service.putJSON('zuege', JSON.stringify(this.zuege))
      .subscribe(
        ret => console.log(ret),
        error => console.log(error));
    this.service.putJSON('color', JSON.stringify(this.myColor))
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
    if (this.kFrom == null) {
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

  toggleRotate(){
    this.rotate = !this.rotate;
    this.setBrett(this.brett);
  }
}
