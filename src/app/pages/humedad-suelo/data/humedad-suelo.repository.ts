import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HumedadSuelo } from '../domain/humedad-suelo.types';

export const HUMEDAD_SUELO_REPOSITORY = new InjectionToken<HumedadSueloRepository>('HUMEDAD_SUELO_REPOSITORY');

export interface HumedadSueloRepository {
  getHumedad(): Promise<HumedadSuelo>;
  getHumedadStream(): Observable<HumedadSuelo>;
}
