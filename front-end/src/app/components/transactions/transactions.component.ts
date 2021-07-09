import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service.service';
import { TransactionService } from 'src/app/services/transaction-service.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less']
})
export class TransactionsComponent implements OnInit {
  static key = 'transactions';
  genericError: string;
  loading: boolean;
  transactionForm: FormGroup;
  transactions: any;
  submitted: boolean;
  constructor(
    private transactionsService: TransactionService, 
    private authService: AuthService, 
    private formBuilder: FormBuilder) 
    { 
    this.transactions = [];
    this.genericError = '';
    this.loading = false;
    this.submitted = false;
    this.transactionForm = this.formBuilder.group({
      amount: ['', Validators.required],
      type: ['', Validators.required],
      target: ['']
    });
  }
  // convenience getter for easy access to form fields
  // @ts-ignore
  get f() { return this.transactionForm?.controls; }

  ngOnInit(): void {
    this.transactionsService.transactions.subscribe(x => console.log(this.transactions = x.transactions));
    this.transactionsService.postTransactionResult.subscribe(x => {
      this.loading = false;    
      this.transactionsService.getTransactions();
      this.authService.getUser();
    });
  }
  getDate(timestamp: any){
    return (new Date(timestamp)).toUTCString()
  }

  async postTransaction(){
    this.submitted = true;
    if (this.transactionForm.invalid) {
      return;
    }
    const data: any = 
    {
      from: this.authService.userData['_value'].username, 
      type: this.f.type.value, 
      amount: this.f.amount.value, 
    };

    if (this.f.type.value === 'transfer') {
      data.to = this.f.target.value
    }

    this.transactionsService.postTransaction(data, true);
    
    this.loading = true;
  }

  getAmountClass(transaction: any){
    return transaction.type;
  }
}
