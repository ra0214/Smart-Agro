import { Component, OnInit } from '@angular/core';
import { HumedadSueloMath } from './domain/humedad-suelo-math';
import { HumedadSuelo } from './domain/humedad-suelo.types';

@Component({
  selector: 'app-humedad-suelo',
  standalone: false,
  templateUrl: './humedad-suelo.component.html',
  styleUrls: ['./humedad-suelo.component.scss']
})
export class HumedadSueloComponent implements OnInit {
  loading = false;
  report: HumedadSuelo | null = null;

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      const data: HumedadSuelo = {
        current: 45,
        min: 29,
        max: 58,
        trend7Days: [39, 43, 47, 45, 49, 46, 45]
      };
      this.report = data;
      this.loading = false;
    }, 300);
  }

  get average() {
    return this.report ? HumedadSueloMath.promedio(this.report.trend7Days) : 0;
  }
}
