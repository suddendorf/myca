import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { GridComponent } from './grid/grid.component';
import { MyMaterialModule } from './material-modul';
import { CalMonthComponent } from './cal-month/cal-month.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    CalMonthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MyMaterialModule
  ],
  exports: [],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
