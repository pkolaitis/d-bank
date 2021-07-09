import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  statistics: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient){ 
    this.statistics = new BehaviorSubject({});
  }

  getStatistics(){
    this.httpClient.get<any>('http://localhost:4201/getStatistics', {}).pipe().subscribe(x => this.statistics.next(x));
  }

}
