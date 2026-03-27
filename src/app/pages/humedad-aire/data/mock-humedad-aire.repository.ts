import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HumedadAireReport } from '../domain/humedad-aire.types';
import { HumedadAireRepository } from './humedad-aire.repository';

@Injectable({ providedIn: 'root' })
export class MockHumedadAireRepository implements HumedadAireRepository {
  getHumedadAireReport(): Observable<HumedadAireReport> {
    return of({
      currentRelativeHumidity: 72,
      currentDewPoint: 14,
      relativeHumiditySeries: [78, 76, 75, 70, 55, 48, 45, 44, 43, 46, 55, 63, 70],
      dewPointSeries: [9, 8, 7, 7, 6, 5, 4, 4, 5, 7, 8, 9, 10],
      labels: ['00', '03', '06', '08', '10', '11', '13', '15', '17', '18', '20', '22', '24']
    }).pipe(delay(300));
  }
}
