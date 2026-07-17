export interface NotaResponseDto {
  id: number;
  titulo: string;
  contenido: string;
  idColeccionAsociada: number;
  idArchivoAdjunto?: number;
}
