export interface NotaRequestDto {
  titulo: string;
  contenido: string;
  idColeccionAsociada: number;
  idArchivoAdjunto?: number;
}
