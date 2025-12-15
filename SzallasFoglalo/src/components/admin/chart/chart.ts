import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true, 
  imports: [BaseChartDirective],
  templateUrl: './chart.html',
  styleUrls: ['./chart.scss']
})
export class ChartComponent implements OnInit {
  @Input() chartType: ChartType = 'line';
  @Input() chartData!: ChartConfiguration['data'];
  @Input() chartOptions?: ChartConfiguration['options'];
  @Input() chartLegend: boolean = true;

  public defaultOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true
  };

  ngOnInit() {
    if (!this.chartOptions) {
      this.chartOptions = this.defaultOptions;
    }
  }
}