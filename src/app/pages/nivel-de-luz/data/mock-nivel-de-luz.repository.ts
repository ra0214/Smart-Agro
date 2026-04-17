import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { switchMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { NivelDeLuzReport, SolarIntensityLinePoint } from '../domain/nivel-de-luz.types';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randIntBetween(min: number, max: number): number {
  return Math.floor(randBetween(min, max + 1));
}

function normalizeSegments(maxScale: number, segments: { darkness: number; direct: number; diffuse: number; reflected: number }) {
  const total = segments.darkness + segments.direct + segments.diffuse + segments.reflected;
  const factor = total > 0 ? maxScale / total : 0;
  return {
    darkness: segments.darkness * factor,
    direct: segments.direct * factor,
    diffuse: segments.diffuse * factor,
    reflected: segments.reflected * factor
  };
}

@Injectable()
export class MockNivelDeLuzRepository {
  getNivelDeLuzReport(): Observable<NivelDeLuzReport> {
    return timer(0, 8000).pipe(
      switchMap(() => of(this.generateReport()).pipe(delay(300)))
    );
  }

  private generateReport(): NivelDeLuzReport {
    const maxScale = 100000;

    const rawSegments = {
      darkness: randBetween(25000, 45000),
      direct: randBetween(25000, 45000),
      diffuse: randBetween(15000, 35000),
      reflected: randBetween(7000, 25000)
    };

    const segments = normalizeSegments(maxScale, rawSegments);

    // Para que el texto superior tenga sentido.
    const totalEnergyReceived = segments.darkness + segments.direct + segments.diffuse + segments.reflected;

    const radiationTrend7Days = Array.from({ length: 7 }).map((_, i) => {
      const dayIndex = i + 1;
      // Radiación alrededor de la imagen: 12..28
      const base = randBetween(13, 20);
      const wave = Math.sin(((i + 1) / 7) * Math.PI) * randBetween(3, 9);
      const value = clamp(base + wave + randBetween(-1.5, 2.5), 10, 30);

      return {
        dayLabel: `1 día ${dayIndex}`,
        value
      };
    });

    const timeLabels = ['00:00', '04:00', '06:00', '12:00', '18:00', '20:00', '24:00'];

    // Genera una curva suave tipo "día" para el gráfico principal (A..G).
    // Usamos una sinusoide y un poco de ruido, escalada a maxScale.
    const linePoints: SolarIntensityLinePoint[] = timeLabels.map((label, i) => {
      const t = i / (timeLabels.length - 1); // 0..1

      // Pico cerca del "mediodía".
      const peak = Math.sin(Math.PI * t); // 0..1
      const noise = randBetween(-0.07, 0.07);
      const shape = clamp(peak + noise, 0, 1);

      // Si querés que el día arranque con algo pequeño y termine estable:
      const tailBias = i >= 5 ? randBetween(-0.03, 0.02) : 0;

      const value = clamp((shape + tailBias) * maxScale, 5000, maxScale);

      return { timeLabel: label, value };
    });

    return {
      solarIntensity: {
        totalEnergyReceived,
        maxScale,
        linePoints,
        segments
      },
      radiationTrend7Days
    };
  }
}
