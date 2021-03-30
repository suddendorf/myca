import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {
  brett:string[]=["wT1","wP1","wL1","wK","wD","wL2","wP2","wT2",
  "wB1","wB2","wB3","wB4","wB5","wB6","wB7","wB8",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "sB1","sB2","sB3","sB4","sB5","sB6","sB7","sB8",
  "sT1","sP1","sL1","sK","sD","sL2","sP2","sT2"
  ];
  zug:string="?";
  constructor() { }

  ngOnInit(): void {
  }
move(){
  this.zug = this.zug.toLowerCase();
  let colA = this.zug.charCodeAt(0) - "a".charCodeAt(0);
  let rowA = this.zug.charCodeAt(1) - "1".charCodeAt(0);
  console.log("colA:"+colA);
  console.log("rowA:"+rowA);
  let from = rowA*8+colA;
  console.log("from:"+from);

  let colB = this.zug.charCodeAt(3) - "a".charCodeAt(0);
  let rowB = this.zug.charCodeAt(4) - "1".charCodeAt(0);
  let to = rowB*8+colB;
  console.log("to:"+to);
  this.brett[to]=this.brett[from];
  this.brett[from]="?";

}
  getColor(i:number):string{
    let n = Math.floor(i/8);
    if ( n%2==0){
      if ( i%2==0){
        return '#eeeeee';
      }else{
        return 'black';
      }
    }else{
      if ( i%2!=0){
        return '#eeeeee';
      }else{
        return 'black';
      }
    }
    return 'red';
  }
}
