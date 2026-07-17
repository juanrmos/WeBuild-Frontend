import { Injectable, inject, signal, computed } from '@angular/core';
import { ArchivoApiRepository } from '../infrastructure/archivo-api.repository';
import { Archivo } from '../domain/models/archivo.model';

@Injectable({ providedIn: 'root' })
export class RepositorioFacade {
  private readonly repo = inject(ArchivoApiRepository);

  readonly archivos = signal<Archivo[]>([]);
  readonly cargando = signal(false);
  readonly subiendo = signal(false);
  readonly error = signal<string | null>(null);
  readonly busqueda = signal('');

  readonly archivosFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase();
    return this.archivos().filter(a => (a.nombre || '').toLowerCase().includes(q));
  });

  async cargarTodos(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const data = await this.repo.listar();
      this.archivos.set(data);
    } catch (e) {
      this.error.set('Error al cargar los archivos');
    } finally {
      this.cargando.set(false);
    }
  }

  async subir(file: File): Promise<void> {
    this.subiendo.set(true);
    this.error.set(null);
    try {
      const nuevo = await this.repo.subir(file);
      this.archivos.update(list => [nuevo, ...list]);
    } catch (e) {
      this.error.set('Error al subir el archivo');
      throw e;
    } finally {
      this.subiendo.set(false);
    }
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.repo.eliminar(id);
      this.archivos.update(list => list.filter(a => a.id !== id));
    } catch (e) {
      this.error.set('Error al eliminar archivo');
      throw e;
    }
  }

  async renombrar(id: number, nuevoNombre: string): Promise<void> {
    try {
      await this.repo.renombrar(id, nuevoNombre);
      this.archivos.update(list => list.map(a => a.id === id ? { ...a, nombre: nuevoNombre } : a));
    } catch (e) {
      this.error.set('Error al renombrar archivo');
      throw e;
    }
  }

  buscar(query: string): void {
    this.busqueda.set(query);
  }
}
