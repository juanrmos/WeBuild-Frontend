import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ColeccionRepository } from '../domain/repositories/coleccion.repository';
import { Coleccion } from '../domain/models/coleccion.model';
import { ColeccionRequestDto } from './dtos/coleccion-request.dto';
import { ColeccionResponseDto } from './dtos/coleccion-response.dto';
import { ColeccionMapper } from './mappers/coleccion.mapper';

@Injectable({ providedIn: 'root' })
export class ColeccionApiRepository implements ColeccionRepository {
  private readonly http = inject(HttpClient);
  // Según backend-contract.md:
  // GET /ListAllColecciones
  // GET /search/Coleccion/ListAll?q=
  // POST /api/Coleccion
  // PUT /api/Coleccion/{id}
  // DELETE /api/Coleccion/{id}
  private readonly baseUrl = 'http://localhost:5149';

  async listar(): Promise<Coleccion[]> {
    const response = await firstValueFrom(
      this.http.get<ColeccionResponseDto[]>(`${this.baseUrl}/ListAllColecciones`)
    );
    return ColeccionMapper.fromResponseDtoArray(response);
  }

  async buscar(query: string): Promise<Coleccion[]> {
    const params = new HttpParams().set('q', query);
    const response = await firstValueFrom(
      this.http.get<ColeccionResponseDto[]>(`${this.baseUrl}/search/Coleccion/ListAll`, { params })
    );
    return ColeccionMapper.fromResponseDtoArray(response);
  }

  async crear(nombre: string): Promise<Coleccion> {
    const payload: ColeccionRequestDto = { nombre };
    const response = await firstValueFrom(
      this.http.post<ColeccionResponseDto>(`${this.baseUrl}/api/Coleccion`, payload)
    );
    return ColeccionMapper.fromResponseDto(response);
  }

  async actualizar(id: number, nombre: string): Promise<Coleccion> {
    const payload: ColeccionRequestDto = { nombre };
    const response = await firstValueFrom(
      this.http.put<ColeccionResponseDto>(`${this.baseUrl}/api/Coleccion/${id}`, payload)
    );
    return ColeccionMapper.fromResponseDto(response);
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/api/Coleccion/${id}`)
    );
  }
}
