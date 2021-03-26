import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, OnInit } from '@angular/core';
import { DateUtil } from '../date-util';
export interface TileM {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'cal-month',
  templateUrl: './cal-month.component.html',
  styleUrls: ['./cal-month.component.scss']
})
export class CalMonthComponent implements OnInit {
  today = new Date();
  month ='?';
  tiles: TileM[] = [
    {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 1, rows: 1, color: '#DDBDF1'},
  ];
  constructor() {
    let i=0;
    this.tiles[i++]= {text: "Monday", cols: 1, rows: 1, color: 'green'};
    this.tiles[i++]= {text: "Tuesday", cols: 1, rows: 1, color: 'green'};
    this.tiles[i++]= {text: "Wednesday", cols: 1, rows: 1, color: 'green'};
    this.tiles[i++]= {text: "Thursday", cols: 1, rows: 1, color: 'green'};
    this.tiles[i++]= {text: "Friday", cols: 1, rows: 1, color: 'green'};
    this.tiles[i++]= {text: "Saturday", cols: 1, rows: 1, color: 'green'};
    this.tiles[i++]= {text: "Sunday", cols: 1, rows: 1, color: 'green'};
   for (i=7;i<42;i++){
      this.tiles[i]= {text: i.toString(), cols: 1, rows: 1, color: 'lightgreen'};
    }
  }

  ngOnInit(): void {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    this.month = DateUtil.getMonthName(dateObj);
    this.tiles[day].color ='red';
  }

}
