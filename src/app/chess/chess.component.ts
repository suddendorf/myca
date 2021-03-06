import { WHITE_ON_BLACK_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  myColor: string;
  interval: any;
  rotate = false;
  vBrett: string[];
  kFrom: number;
  kTo: number;
  favIcon: HTMLLinkElement;
  zugSelected: number = -1;
  constructor(private service: DataService, private titleService: Title) { }

  ngOnInit(): void {
    this.setTitle("who");
    this.service.getJSON('brett')
      .subscribe(
        ret => this.setBrett(ret),
        error => console.log(error));
    this.service.getJSON('zuege')
      .subscribe(
        ret => { this.zuege = ret; this.scrollToBottom('zuege'); }
        ,
        error => console.log(error));

    this.interval = setInterval(() => {
      this.read();
    }, 1000 * 1);
    this.myColor = sessionStorage.getItem('color');
    if (this.myColor == null) {
      this.myColor = 'white';
    }
    this.brett = JSON.parse(sessionStorage.getItem('brett'));
    this.favIcon = document.querySelector('#appIcon');

    this.favIcon.href = 'assets/wK.ico';
  }
  setTitle(s: string) {

    this.titleService.setTitle("Chess: " + s);
  }
  getWidth(): number {
    let w = Math.min(window.innerWidth, window.innerHeight * 0.9) * 0.9;
    return w;
  }

  read() {
    console.log('reading:' + new Date().toISOString());
    this.readDetails();
  }
  readDetails() {
    let d = new Date();
    this.service.getJSON('brett')
      .subscribe(
        ret => this.setBrett(ret),
        error => console.log(error));
    this.service.getJSON('zuege')
      .subscribe(
        ret => { this.setZuege(ret); }
        ,
        error => console.log(error));
  }
  setZuege(ret: any) {
    this.zuege = ret;
    if (this.zuege != null) {
      if (this.zuege.length % 2 == 0) {
        this.status = 'white';
        this.setTitle('white');

        this.favIcon.href = 'assets/wK.ico';
      } else {
        this.status = 'black';
        this.setTitle('black');
        this.favIcon.href = 'assets/sK.ico';
      }

      this.scrollToBottom('zuege');
    }
  }
  canMove(): boolean {
    if (this.zug == null || this.zug.indexOf('?') >= 0) {
      return false;
    }
    if ( this.zugSelected >=0){
      return false;
    }
    if (this.zuege != null) {
      if (this.zuege.length % 2 == 0 && this.myColor == 'white') {
        return true;
      } else if (this.zuege.length % 2 == 1 && this.myColor == 'black') {
        return true;
      }
    }
    return false;

  }
  setBrett(brett: string[]): void {
    this.brett = brett;
    this.vBrett = Array.from(brett);
    if (this.rotate) {
      for (let i = 0; i < brett.length; i++) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        this.vBrett[(7 - row) * 8 + col] = this.brett[i];
      }
    }
  }

  scrollToBottom(id: string) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
  }
  onResize(event: any) {

  }
  getHeight() {
    return this.getWidth();
  }
  reset(): void {
    this.brett = ChessComponent.brettStart;
    sessionStorage.setItem('brett', JSON.stringify(this.brett));
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
    this.myColor = null;

    sessionStorage.removeItem('color');

    this.rotate = false;
    this.vBrett = Array.from(this.brett);
  }
  move(): void {
    let from = this.kFrom;
    let to = this.kTo;//ChessComponent.getPos(this.zug.substring(3));
    if (to == null) return;
    console.log("to:" + to);
    this.moveWithRule(from, to);
    this.setBrett(this.brett);

    sessionStorage.setItem('brett', JSON.stringify(this.brett));
    this.service.putJSON('brett', JSON.stringify(this.brett))
      .subscribe(
        ret => this.addZug(this.zug),
        error => console.log(error));
    let d = new Date();
    let sd = d.toISOString().substring(0, 19);
    this.service.putJSON('brett' + sd, JSON.stringify(this.brett))
      .subscribe(
        ret => console.log(ret),
        error => console.log(error));

    this.kFrom = this.kTo = null;


  }
  noPick(from: number) {
    let figure = this.brett[from];
    console.log("Figur:" + figure);
    if (!figure || figure.length < 2) {
      return true;
    }
    if (this.wrongColor(from)) return true;
    return false;
  }
  wrongColor(from: number) {
    let figure = this.brett[from];
    if ('black' == this.myColor) {
      if (figure.startsWith('w')) {
        return true;
      }
    }

    if ('white' == this.myColor) {
      if (figure.startsWith('s')) {
        return true;
      }
    }
  }
  moveWithRule(from: number, to: number) {
    const figur = this.brett[from];
    const row = Math.floor(to / 8);
    //rochade
    if (figur.substring(0, 2) == 'wK' && from == 60) {
      if (to == 62) {
        this.brett[to] = this.brett[from];
        this.brett[from] = "";
        this.brett[61] = 'wT2';
        this.brett[63] = "";
        return;
      }
      if (to == 58) {
        this.brett[to] = this.brett[from];
        this.brett[from] = "";
        this.brett[59] = 'wT1';
        this.brett[56] = "";
        return;
      }
    }

    if (figur.substring(0, 2) == 'sK' && from == 4) {
      if (to == 6) {
        this.brett[to] = this.brett[from];
        this.brett[from] = "";
        this.brett[5] = 'sT2';
        this.brett[7] = "";
        return;
      }
      if (to == 2) {
        this.brett[to] = this.brett[from];
        this.brett[from] = "";
        this.brett[3] = 'sT1';
        this.brett[0] = "";
        return;
      }
    }
    //Bauerntausch
    if (figur.substring(0, 2) == 'wB') {
      if (row == 0) {
        this.brett[to] = 'wD';
        this.brett[from] = "";
        return;
      }
    }
    if (figur.substring(0, 2) == 'sB') {
      if (row == 7) {
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
    if (this.zuege.length % 2 == 0) {
      this.myColor = 'white';
    } else {
      this.myColor = 'black';
    }

    sessionStorage.setItem('color', this.myColor);
    this.zuege.push(this.zug);

    const z = Object.assign([], this.zuege);
    this.zuege = z;
    this.scrollToBottom('zuege');
    this.service.putJSON('zuege', JSON.stringify(this.zuege))
      .subscribe(
        ret => console.log(ret),
        error => console.log(error));

  }
  getImage(i: number): string {
    let name = this.vBrett[i];
    if (name && name.length > 2) {
      name = name.substring(0, 2);
    }
    return "./assets/" + name + ".svg";
  }
  select(i: number) {
    if (this.rotate) {
      const row = 7 - Math.floor(i / 8);
      const col = i % 8;
      i = row * 8 + col;
    }
    if (this.kFrom == i) {
      this.kFrom = null;
      return;
    }

    if (this.kTo == i) {
      this.kTo = null;
      return;
    }
    if (this.kFrom == null) {
      if (this.noPick(i)) return;
      this.kFrom = i;
    } else {
      this.kTo = i;
      if (this.wrongColor(i)) return;
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
    if (this.rotate) {
      const row = 7 - Math.floor(i / 8);
      const col = i % 8;
      i = row * 8 + col;
    }
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

  toggleRotate() {
    this.rotate = !this.rotate;
    this.setBrett(this.brett);
  }
  toggleColor() {
    if (this.myColor == 'black') {
      this.myColor = 'white';
    } else {
      this.myColor = 'black';
    }
    console.log(this.myColor);
  }
  replay(i: number): void {
    clearInterval( this.interval);
    console.log(i);
    this.zugSelected = i;
    this.brett = Array.from(ChessComponent.brettStart);
    for (let j = 0; j <= i; j++) {
      let zug = this.zuege[j];
      let from = zug.substring(0,2);
      let to = zug.substring(3,5);
      let f = ChessComponent.getPos(from);
      let t = ChessComponent.getPos(to);
      console.log(f,t);
      this.kFrom = f;
      this.kTo = t;
      this.moveWithRule(f,t);
    }
    this.setBrett(this.brett);
  }
  static getPos(z: string): number {
    if (!z) return -1;
    z = z.toLowerCase();
    let colA = z.charCodeAt(0) - "a".charCodeAt(0);
    let rowA = z.charCodeAt(1) - "1".charCodeAt(0);
    console.log("colA:" + colA);
    console.log("rowA:" + rowA);
    let from = (7 - rowA) * 8 + colA;
    console.log("from:" + from);
    return from;
  }
  getZugColor(i:number){
    if ( this.zugSelected == i){
      return 'green';
    }
    if ( this.zuege && i%2==1){
      return 'grey';
    }
    return 'white';
  }
}
