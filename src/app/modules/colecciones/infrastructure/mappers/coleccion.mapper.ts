import { Coleccion } from '../../domain/models/coleccion.model';
import { ColeccionResponseDto } from '../dtos/coleccion-response.dto';

export class ColeccionMapper {
  static fromResponseDto(dto: ColeccionResponseDto): Coleccion {
    return {
      id: dto.idColeccion ?? dto.id ?? 0,
      nombre: dto.nombreColeccion ?? dto.nombre ?? 'Sin nombre'
    };
  }

  static fromResponseDtoArray(dtos: ColeccionResponseDto[]): Coleccion[] {
    return dtos.map(dto => this.fromResponseDto(dto));
  }
}
