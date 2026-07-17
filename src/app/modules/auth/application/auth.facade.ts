import { Injectable, inject, signal } from '@angular/core';
import { AuthApiRepository } from '../infrastructure/auth-api.repository';
import { Usuario } from '../domain/models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly repo = inject(AuthApiRepository);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  async login(email: string, password: string): Promise<{ token: string; usuario: Usuario } | null> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const result = await this.repo.login(email, password);
      return result;
    } catch (e) {
      this.error.set('Credenciales inválidas o error de conexión');
      return null;
    } finally {
      this.cargando.set(false);
    }
  }

  async register(nombre: string, email: string, password: string): Promise<boolean> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      await this.repo.register(nombre, email, password);
      return true;
    } catch (e: any) {
      this.error.set(e.error?.message || 'Error al registrar el usuario');
      return false;
    } finally {
      this.cargando.set(false);
    }
  }

  logout(): void {
    this.repo.logout();
  }
}
