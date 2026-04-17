import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { switchMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { HumedadAireReport } from '../domain/humedad-aire.types';
import { HumedadAireRepository } from './humedad-aire.repository';

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Calcula el punto de rocío usando la fórmula Magnus aproximada */
function dewPoint(tempC: number, relHumidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(relHumidity / 100);
  return (b * alpha) / (a - alpha);
}

function generateReport(): HumedadAireReport {
  // Humedad relativa base diaria (más alta de madrugada, baja al mediodía)
  const baseHumidity = randBetween(55, 85);
  const amplitude = randBetween(10, 25);

  const labels = ['00', '03', '06', '08', '10', '11', '13', '15', '17', '18', '20', '22', '24'];
  const hours  = [   0,    3,    6,    8,   10,   11,   13,   15,   17,   18,   20,   22,   24];

  const relativeHumiditySeries = hours.map(h => {
    // Curva: humedad alta en la madrugada, baja al mediodía
    const t = h / 24;
    const curve = Math.cos(2 * Math.PI * (t - 0.0)) * amplitude;
    const noise = randBetween(-4, 4);
    return Math.round(clamp(baseHumidity + curve + noise, 20, 99));
  });

  const baseTemp = randBetween(15, 28);
  const dewPointSeries = relativeHumiditySeries.map((rh, i) => {
    // Temperatura varía a lo largo del día (pico al mediodía)
    const h = hours[i];
    const t = h / 24;
    const tempVariation = Math.sin(Math.PI * (t - 0.15)) * randBetween(4, 8);
    const temp = baseTemp + tempVariation + randBetween(-1, 1);
    return Math.round(dewPoint(temp, rh) * 10) / 10;
  });

  // Valores actuales: último punto registrado con algo de ruido
  const currentRelativeHumidity = Math.round(clamp(
    relativeHumiditySeries[relativeHumiditySeries.length - 1] + randBetween(-3, 3),
    20, 99
  ));
  const currentDewPoint = Math.round(dewPointSeries[dewPointSeries.length - 1] * 10) / 10;

  return {
    currentRelativeHumidity,
    currentDewPoint,
    relativeHumiditySeries,
    dewPointSeries,
    labels
  };
}

@Injectable({ providedIn: 'root' })
export class MockHumedadAireRepository implements HumedadAireRepository {
  /**
   * Emite un reporte generado aleatoriamente al inicio,
   * y luego emite uno nuevo cada 8 segundos simulando datos en tiempo real.
   */
  getHumedadAireReport(): Observable<HumedadAireReport> {
    return timer(0, 8000).pipe(
      switchMap(() => of(generateReport()).pipe(delay(300)))
    );
  }
}
