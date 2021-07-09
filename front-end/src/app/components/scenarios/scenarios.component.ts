import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/services/transaction-service.service';
import { createTransaction, getRandomNumber, scenarios} from './scenarios';
@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {
  static key: any = 'scenarios';
  scenarios: any;
  loading: boolean;
  submitted: boolean;
  scenarioForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private transactionsService: TransactionService) { 
    this.scenarios = scenarios;
    this.loading = false;
    this.submitted = false;
    this.scenarioForm = this.scenarioForm = this.formBuilder.group({
      scenario: [this.scenarios[0].key, Validators.required]
    });
  }
  
  // convenience getter for easy access to form fields
  // @ts-ignore
  get f() { return this.scenarioForm?.controls; }

  ngOnInit(): void {
    
  }
  runScenario(){
    this.submitted = true;
    if (this.scenarioForm.invalid) {
      return;
    }
    this.loading = true;
    const data = this.scenarios.filter((x:any) => x.key === this.f.scenario.value)[0];
    this.createTransactions(data.transactions, data.allowKills);
    this.loading = false;
  }

  createTransactions(size: number, allowKills?: boolean){
    const result = [];
    for(let i=0;i<size;i++){
        if(allowKills && getRandomNumber() > 98) {
            this.transactionsService.kill();
        }
        this.transactionsService.postTransaction(createTransaction(), i===(size-1));
    }
  }
  
  

}
