export interface Archivo {
  id: number;
  nombre: string;
  url: string;
  fechaCreacion: string;
  notasAsociadas: { idNota: number; idColeccion: number }[];
}
