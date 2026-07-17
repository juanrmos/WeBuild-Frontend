import { Archivo } from '../../domain/models/archivo.model';
import { ArchivoResponseDto } from '../dtos/archivo-response.dto';

export class ArchivoMapper {
  static fromResponseDto(dto: any): Archivo {
    return {
      id: dto.id ?? dto.Id ?? 0,
      nombre: dto.nombre ?? dto.Nombre ?? 'Sin nombre',
      url: dto.url ?? dto.Url ?? '',
      fechaCreacion: dto.fechaCreacion ?? dto.FechaCreacion ?? new Date().toISOString(),
      notasAsociadas: dto.notasAsociadas ?? dto.NotasAsociadas ?? []
    };
  }

  static fromResponseDtoArray(dtos: ArchivoResponseDto[]): Archivo[] {
    return dtos.map(dto => this.fromResponseDto(dto));
  }
}
