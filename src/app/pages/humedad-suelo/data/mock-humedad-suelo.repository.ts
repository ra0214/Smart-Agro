import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { switchMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { HumedadSueloRepository } from './humedad-suelo.repository';
import { HumedadSuelo } from '../domain/humedad-suelo.types';

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function generateHumedadSuelo(): HumedadSuelo {
  // Rango base del día: suelo agrícolamente realista (20–80%)
  const current = Math.round(randBetween(28, 72));

  // Min y Max del período observado
  const spread = randBetween(8, 22);
  const min = Math.round(clamp(current - spread * randBetween(0.4, 0.7), 10, current - 2));
  const max = Math.round(clamp(current + spread * randBetween(0.3, 0.6), current + 2, 90));

  // Tendencia de 7 días con curva + ruido (simula lluvia/evapotranspiración)
  const baseLevel = randBetween(30, 65);
  const phase = randBetween(0, Math.PI);
  const trend7Days = Array.from({ length: 7 }, (_, i) => {
    const wave = Math.sin((i / 6) * Math.PI * 1.5 + phase) * randBetween(5, 15);
    const noise = randBetween(-4, 4);
    return Math.round(clamp(baseLevel + wave + noise, 10, 90));
  });

  return { current, min, max, trend7Days };
}

@Injectable({ providedIn: 'root' })
export class MockHumedadSueloRepository implements HumedadSueloRepository {
  /**
   * Emite un reporte generado aleatoriamente al inicio,
   * y luego emite uno nuevo cada 8 segundos simulando sensores en tiempo real.
   */
  getHumedad(): Promise<HumedadSuelo> {
    return Promise.resolve(generateHumedadSuelo());
  }

  /**
   * Versión reactiva para actualizaciones periódicas (cada 8 s).
   */
  getHumedadStream(): Observable<HumedadSuelo> {
    return timer(0, 8000).pipe(
      switchMap(() => of(generateHumedadSuelo()).pipe(delay(300)))
    );
  }
}
