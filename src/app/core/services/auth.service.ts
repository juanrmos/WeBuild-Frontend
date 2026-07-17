import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'wb_token';
  private readonly userKey = 'wb_user';

  // Signals para el estado global (como indica angular-core.md)
  private readonly _token = signal<string | null>(localStorage.getItem(this.tokenKey));
  private readonly _usuario = signal<any | null>(
    localStorage.getItem(this.userKey) ? JSON.parse(localStorage.getItem(this.userKey)!) : null
  );

  readonly estaAutenticado = computed(() => !!this._token());
  readonly usuarioActual = computed(() => this._usuario());
  readonly token = computed(() => this._token());

  constructor() {
    // Sincronizar con localStorage cuando los signals cambien
    effect(() => {
      const token = this._token();
      const user = this._usuario();
      if (token) {
        localStorage.setItem(this.tokenKey, token);
      } else {
        localStorage.removeItem(this.tokenKey);
      }

      if (user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.userKey);
      }
    });
  }

  setSession(token: string, usuario: any): void {
    this._token.set(token);
    this._usuario.set(usuario);
  }

  clearSession(): void {
    this._token.set(null);
    this._usuario.set(null);
  }
}
