import { Archivo } from '../models/archivo.model';

export abstract class ArchivoRepository {
  abstract listar(): Promise<Archivo[]>;
  abstract subir(file: File): Promise<Archivo>;
  abstract eliminar(id: number): Promise<void>;
}
