import { Coleccion } from '../models/coleccion.model';

export abstract class ColeccionRepository {
  abstract listar(): Promise<Coleccion[]>;
  abstract buscar(query: string): Promise<Coleccion[]>;
  abstract crear(nombre: string): Promise<Coleccion>;
  abstract actualizar(id: number, nombre: string): Promise<Coleccion>;
  abstract eliminar(id: number): Promise<void>;
}
