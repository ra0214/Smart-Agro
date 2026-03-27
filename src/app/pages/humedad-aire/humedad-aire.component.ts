import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { promedio } from './domain/humedad-aire-math';
import { HumedadAireReport } from './domain/humedad-aire.types';
import {
  HUMEDAD_AIRE_REPOSITORY,
  HumedadAireRepository
} from './data/humedad-aire.repository';

@Component({
  selector: 'app-humedad-aire',
  standalone: false,
  templateUrl: './humedad-aire.component.html',
  styleUrl: './humedad-aire.component.scss'
})
export class HumedadAireComponent implements OnInit, OnDestroy {
  loading = true;
  report: HumedadAireReport | null = null;

  private sub: Subscription | null = null;

  constructor(
    @Inject(HUMEDAD_AIRE_REPOSITORY)
    private readonly repo: HumedadAireRepository
  ) {}

  ngOnInit(): void {
    this.sub = this.repo.getHumedadAireReport().subscribe({
      next: (report) => {
        this.report = report;
        this.loading = false;
      },
      error: (err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get promedioHumedad(): number {
    return this.report ? promedio(this.report.relativeHumiditySeries) : 0;
  }
}
