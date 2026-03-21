import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import {
  TemperatureAmbientReport,
  TemperatureHourlyPoint,
  TemperatureTrendPoint
} from '../domain/temperature-ambient.types';
import { normalizeAmbientReport } from '../domain/temperature-ambient-math';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randIntBetween(min: number, max: number): number {
  return Math.floor(randBetween(min, max + 1));
}

@Injectable()
export class MockTemperatureAmbientRepository {
  getAmbientTemperatureReport(): Observable<TemperatureAmbientReport> {
    const daily = this.generateDailyPoints();
    const trend7Days = this.generateTrend7Days();
    return of(
      normalizeAmbientReport({
        daily,
        trend7Days
      })
    );
  }

  private generateDailyPoints(): TemperatureHourlyPoint[] {
    const daily: TemperatureHourlyPoint[] = [];

    const base = randBetween(18, 23);
    const amplitude = randBetween(5, 8);

    for (let hour = 0; hour < 24; hour++) {
      const minute = randIntBetween(0, 59);
      const hourFrac = hour + minute / 60;

      // Curva senoidal con ruido para simular un día real.
      const seasonal =
        base + amplitude * Math.sin(((hourFrac - 4) / 24) * 2 * Math.PI);
      const noise = randBetween(-1.1, 1.1);
      const tempC = clamp(seasonal + noise, 0, 35);

      daily.push({ hour, minute, tempC });
    }

    return daily.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  }

  private generateTrend7Days(): TemperatureTrendPoint[] {
    const trend: TemperatureTrendPoint[] = [];
    const base = randBetween(18, 22);
    const amplitude = randBetween(4, 7);

    const phase = randBetween(0, Math.PI * 2);

    for (let i = 0; i < 7; i++) {
      const tempC =
        base +
        amplitude * Math.sin(((i + 1) / 7) * 2 * Math.PI + phase) +
        randBetween(-1.2, 1.2);
      trend.push({
        dayLabel: `Día ${i + 1}`,
        tempC: clamp(tempC, 0, 35)
      });
    }

    return trend;
  }
}

