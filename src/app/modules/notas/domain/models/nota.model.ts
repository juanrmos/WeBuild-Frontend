export interface Nota {
  id: number;
  titulo: string;
  contenido: string;
  idColeccionAsociada: number;
  idArchivoAdjunto?: number;
}
