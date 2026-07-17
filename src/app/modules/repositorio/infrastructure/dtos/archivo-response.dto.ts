export interface ArchivoResponseDto {
  id: number;
  nombre: string;
  url: string;
  fechaCreacion?: string;
  notasAsociadas?: { idNota: number; idColeccion: number }[];
}
