import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  static key = "statistics";
  statistics: any;
  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.statisticsService.statistics.subscribe((x:any) => this.statistics = x);
  }

}
