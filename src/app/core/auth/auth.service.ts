import { Injectable } from '@angular/core';
import { User } from '../../pages/login/domain/login.types';

const SESSION_KEY = 'smartagro_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser: User | null = null;

  constructor() {
    // Restaurar sesión desde localStorage al iniciar la app
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        this._currentUser = JSON.parse(saved) as User;
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }

  get currentUser(): User | null {
    return this._currentUser;
  }

  isAuthenticated(): boolean {
    return this._currentUser !== null;
  }

  login(user: User): void {
    this._currentUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  logout(): void {
    this._currentUser = null;
    localStorage.removeItem(SESSION_KEY);
  }
}
