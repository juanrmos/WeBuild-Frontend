import { Usuario } from '../models/usuario.model';

export abstract class AuthRepository {
  abstract login(email: string, password: string): Promise<{ token: string; usuario: Usuario }>;
  abstract register(nombre: string, email: string, password: string): Promise<void>;
  abstract logout(): void;
}
