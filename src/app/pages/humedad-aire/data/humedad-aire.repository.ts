import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HumedadAireReport } from '../domain/humedad-aire.types';

export const HUMEDAD_AIRE_REPOSITORY = new InjectionToken<HumedadAireRepository>('HUMEDAD_AIRE_REPOSITORY');

export interface HumedadAireRepository {
  getHumedadAireReport(): Observable<HumedadAireReport>;
}
