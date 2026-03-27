import { Injectable } from '@angular/core';
import { HumedadSueloRepository } from './humedad-suelo.repository';
import { HumedadSuelo } from '../domain/humedad-suelo.types';

@Injectable({ providedIn: 'root' })
export class MockHumedadSueloRepository implements HumedadSueloRepository {
  getHumedad(): Promise<HumedadSuelo> {
    return Promise.resolve({
      current: 45,
      min: 29,
      max: 58,
      trend7Days: [39, 43, 47, 45, 49, 46, 45]
    });
  }
}
