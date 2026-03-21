import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { NivelDeLuzReport } from '../domain/nivel-de-luz.types';

export interface NivelDeLuzRepository {
  getNivelDeLuzReport(): Observable<NivelDeLuzReport>;
}

export const NIVEL_DE_LUZ_REPOSITORY =
  new InjectionToken<NivelDeLuzRepository>('NivelDeLuzRepository');

