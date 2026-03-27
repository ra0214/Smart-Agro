import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuthResponse, Credentials, User } from '../domain/login.types';
import { LoginRepository } from './login.repository';

@Injectable()
export class MockLoginRepository implements LoginRepository {
  private readonly validCredentials = {
    username: 'admin',
    password: '1234'
  };

  authenticate(credentials: Credentials): Observable<AuthResponse> {
    const isValid =
      credentials.username === this.validCredentials.username &&
      credentials.password === this.validCredentials.password;

    const response: AuthResponse = isValid
      ? {
          success: true,
          user: {
            id: '1',
            username: 'admin',
            email: 'admin@smartagro.com'
          }
        }
      : {
          success: false,
          error: 'Usuario o contraseña incorrectos'
        };

    // Simula latencia de red
    return of(response).pipe(delay(500));
  }
}
