import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, Credentials } from '../domain/login.types';

export interface LoginRepository {
  authenticate(credentials: Credentials): Observable<AuthResponse>;
}

export const LOGIN_REPOSITORY =
  new InjectionToken<LoginRepository>('LoginRepository');
