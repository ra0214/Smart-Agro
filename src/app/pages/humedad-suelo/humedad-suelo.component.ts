import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HumedadSueloMath } from './domain/humedad-suelo-math';
import { HumedadSuelo } from './domain/humedad-suelo.types';
import {
  HUMEDAD_SUELO_REPOSITORY,
  HumedadSueloRepository
} from './data/humedad-suelo.repository';

@Component({
  selector: 'app-humedad-suelo',
  standalone: false,
  templateUrl: './humedad-suelo.component.html',
  styleUrls: ['./humedad-suelo.component.scss']
})
export class HumedadSueloComponent implements OnInit, OnDestroy {
  loading = true;
  report: HumedadSuelo | null = null;

  private sub: Subscription | null = null;

  constructor(
    @Inject(HUMEDAD_SUELO_REPOSITORY)
    private readonly repo: HumedadSueloRepository
  ) {}

  ngOnInit(): void {
    this.sub = this.repo.getHumedadStream().subscribe({
      next: (data) => {
        this.report = data;
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

  get average() {
    return this.report ? HumedadSueloMath.promedio(this.report.trend7Days) : 0;
  }
}
