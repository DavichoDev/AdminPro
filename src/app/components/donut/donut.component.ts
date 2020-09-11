import { Component, Input } from '@angular/core';

import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styles: [
  ]
})
export class DonutComponent {

  @Input() tituloGrafica: string = 'Sin titulo';
  @Input('labels') public doughnutChartLabels: Label[] = ['Ejemplo', 'Ejemplo', 'Ejemplo'];
  @Input('data') public doughnutChartData: MultiDataSet = [ [100, 100, 100] ];

}
