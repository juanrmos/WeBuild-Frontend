import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArchivoRepository } from '../domain/repositories/archivo.repository';
import { Archivo } from '../domain/models/archivo.model';
import { ArchivoResponseDto } from './dtos/archivo-response.dto';
import { ArchivoMapper } from './mappers/archivo.mapper';

@Injectable({ providedIn: 'root' })
export class ArchivoApiRepository implements ArchivoRepository {
  private readonly http = inject(HttpClient);
  // GET /api/Repositorio
  // POST /api/Repositorio/upload
  // DELETE /api/Repositorio/{id}
  private readonly baseUrl = 'http://localhost:5149/api/Repositorio';

  async listar(): Promise<Archivo[]> {
    const response = await firstValueFrom(
      this.http.get<ArchivoResponseDto[]>(this.baseUrl)
    );
    return ArchivoMapper.fromResponseDtoArray(response);
  }

  async subir(file: File): Promise<Archivo> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await firstValueFrom(
      this.http.post<ArchivoResponseDto>(`${this.baseUrl}/upload`, formData)
    );
    return ArchivoMapper.fromResponseDto(response);
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/${id}`)
    );
  }

  async renombrar(id: number, nuevoNombre: string): Promise<void> {
    await firstValueFrom(
      this.http.put<void>(`${this.baseUrl}/${id}`, { nombre: nuevoNombre })
    );
  }
}
