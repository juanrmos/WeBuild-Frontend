import { Usuario } from '../../domain/models/usuario.model';
import { LoginResponseDto } from '../dtos/login-response.dto';

export class AuthMapper {
  static fromLoginResponseDto(dto: LoginResponseDto): { token: string; usuario: Usuario } {
    return {
      token: dto.token,
      usuario: {
        id: dto.usuario.id,
        nombre: dto.usuario.nombre,
        email: dto.usuario.email,
        rol: dto.usuario.rol
      }
    };
  }
}
