import { Nota } from '../models/nota.model';

export abstract class NotaRepository {
  abstract listarTodas(): Promise<Nota[]>;
  abstract cargarPorId(id: number): Promise<Nota>;
  abstract buscarEnColeccion(idColeccion: number, query: string): Promise<Nota[]>;
  abstract crear(nota: Omit<Nota, 'id'>): Promise<void>;
  abstract actualizar(id: number, nota: Omit<Nota, 'id'>): Promise<void>;
  abstract eliminar(id: number): Promise<void>;
}
