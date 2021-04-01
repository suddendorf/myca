import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  //server: string="http://localhost:8080/map/Mapping";
  server: string="http://sddb.de/persist/Mapping";
  static version =1;

  constructor(private http: HttpClient) { }

  public getJSON(key:string): Observable<any> {
    key = key+DataService.version;
    let url = this.server+"?action=get&key="+key;
    console.log(url);
    return this.http.get(url);
  }

  putJSON(key: string, value: string) {
    key = key+DataService.version;
    let url = this.server+"?action=put&key="+key+"&value="+value;
    url = encodeURI(url);
    console.log(url);
    return this.http.get(url);
  }

}
