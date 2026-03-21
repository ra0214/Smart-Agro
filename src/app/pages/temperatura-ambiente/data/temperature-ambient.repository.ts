import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TemperatureAmbientReport } from '../domain/temperature-ambient.types';

export interface TemperatureAmbientRepository {
  getAmbientTemperatureReport(): Observable<TemperatureAmbientReport>;
}

export const TEMPERATURE_AMBIENT_REPOSITORY =
  new InjectionToken<TemperatureAmbientRepository>('TemperatureAmbientRepository');

