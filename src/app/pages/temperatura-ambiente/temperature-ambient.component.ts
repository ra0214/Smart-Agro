import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  TemperatureAmbientReport,
  TemperatureStats
} from './domain/temperature-ambient.types';
import { calculateTemperatureStats } from './domain/temperature-ambient-math';
import {
  TEMPERATURE_AMBIENT_REPOSITORY,
  TemperatureAmbientRepository
} from './data/temperature-ambient.repository';

@Component({
  selector: 'app-temperature-ambient',
  standalone: false,
  templateUrl: './temperature-ambient.component.html',
  styleUrl: './temperature-ambient.component.scss'
})
export class TemperatureAmbientComponent implements OnInit, OnDestroy {
  loading = true;
  report: TemperatureAmbientReport | null = null;
  stats: TemperatureStats | null = null;

  private sub: Subscription | null = null;

  constructor(
    @Inject(TEMPERATURE_AMBIENT_REPOSITORY)
    private readonly repo: TemperatureAmbientRepository
  ) {}

  ngOnInit(): void {
    this.sub = this.repo.getAmbientTemperatureReport().subscribe({
      next: (r) => {
        this.report = r;
        this.stats = calculateTemperatureStats(r.daily);
        this.loading = false;
      },
      error: (err) => {
        // Por ahora solo logueamos; luego puedes mostrar un UI de error.
        // eslint-disable-next-line no-console
        console.error(err);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

