import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NotaRepository } from '../domain/repositories/nota.repository';
import { Nota } from '../domain/models/nota.model';
import { NotaRequestDto } from './dtos/nota-request.dto';
import { NotaResponseDto } from './dtos/nota-response.dto';
import { NotaMapper } from './mappers/nota.mapper';

@Injectable({ providedIn: 'root' })
export class NotaApiRepository implements NotaRepository {
  private readonly http = inject(HttpClient);
  // Según backend-contract.md:
  // GET /ListAll
  // GET /api/Nota/{id}
  // GET /search/{idColeccion}/ListAll?q=
  // POST /Create
  // PUT /api/Nota/{id}
  // DELETE /api/Nota/{id}
  private readonly baseUrl = 'http://localhost:5149';

  async listarTodas(): Promise<Nota[]> {
    const response = await firstValueFrom(
      this.http.get<NotaResponseDto[]>(`${this.baseUrl}/ListAll`)
    );
    return NotaMapper.fromResponseDtoArray(response);
  }

  async cargarPorId(id: number): Promise<Nota> {
    const response = await firstValueFrom(
      this.http.get<NotaResponseDto>(`${this.baseUrl}/api/Nota/${id}`)
    );
    return NotaMapper.fromResponseDto(response);
  }

  async buscarEnColeccion(idColeccion: number, query: string): Promise<Nota[]> {
    const params = new HttpParams().set('q', query);
    const response = await firstValueFrom(
      this.http.get<NotaResponseDto[]>(`${this.baseUrl}/search/${idColeccion}/ListAll`, { params })
    );
    return NotaMapper.fromResponseDtoArray(response);
  }

  async crear(nota: Omit<Nota, 'id'>): Promise<void> {
    const payload: NotaRequestDto = {
      titulo: nota.titulo,
      contenido: nota.contenido,
      idColeccionAsociada: nota.idColeccionAsociada,
      idArchivoAdjunto: nota.idArchivoAdjunto
    };
    await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/Create`, payload)
    );
  }

  async actualizar(id: number, nota: Omit<Nota, 'id'>): Promise<void> {
    const payload: NotaRequestDto = {
      titulo: nota.titulo,
      contenido: nota.contenido,
      idColeccionAsociada: nota.idColeccionAsociada,
      idArchivoAdjunto: nota.idArchivoAdjunto
    };
    await firstValueFrom(
      this.http.put<any>(`${this.baseUrl}/api/Nota/${id}`, payload)
    );
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/api/Nota/${id}`)
    );
  }
}
