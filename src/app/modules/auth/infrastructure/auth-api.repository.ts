import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { Usuario } from '../domain/models/usuario.model';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { AuthMapper } from './mappers/auth.mapper';

@Injectable({ providedIn: 'root' })
export class AuthApiRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5149/api/Auth';

  async login(email: string, password: string): Promise<{ token: string; usuario: Usuario }> {
    const payload: LoginRequestDto = { email, password };
    const response = await firstValueFrom(
      this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, payload)
    );
    return AuthMapper.fromLoginResponseDto(response);
  }

  async register(nombre: string, email: string, password: string): Promise<void> {
    const payload: RegisterRequestDto = { nombre, email, password };
    await firstValueFrom(
      this.http.post(`${this.apiUrl}/register`, payload)
    );
  }

  logout(): void {
    // Para la fase 1, el logout local basta, pero si hubiera endpoint sería aquí
  }
}
