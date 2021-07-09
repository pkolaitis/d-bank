import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactions: BehaviorSubject<any>;
  postTransactionResult: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient){ 
    this.transactions = new BehaviorSubject({});
    this.postTransactionResult = new BehaviorSubject({});
  }

  getTransactions(){
    this.httpClient.get<any>('http://localhost:4201/getTransactions', {}).pipe().subscribe(x => this.transactions.next(x));
  }

  postTransaction(data: any, shouldUpdate: boolean){
    // console.log(data);
    this.httpClient.post<any>('http://localhost:4201/transact', {}, { headers: data}).pipe().subscribe(x => shouldUpdate && this.postTransactionResult.next(x));
  }

  kill(){
    this.httpClient.post<any>('http://localhost:4201/kill', {});
  }
}
