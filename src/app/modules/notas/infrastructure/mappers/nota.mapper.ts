import { Nota } from '../../domain/models/nota.model';
import { NotaResponseDto } from '../dtos/nota-response.dto';

export class NotaMapper {
  static fromResponseDto(dto: NotaResponseDto): Nota {
    return {
      id: dto.id,
      titulo: dto.titulo,
      contenido: dto.contenido,
      idColeccionAsociada: dto.idColeccionAsociada,
      idArchivoAdjunto: dto.idArchivoAdjunto
    };
  }

  static fromResponseDtoArray(dtos: NotaResponseDto[]): Nota[] {
    return dtos.map(dto => this.fromResponseDto(dto));
  }
}
