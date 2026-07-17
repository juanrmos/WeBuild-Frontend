import { Injectable, inject, signal, computed } from '@angular/core';
import { NotaApiRepository } from '../infrastructure/nota-api.repository';
import { Nota } from '../domain/models/nota.model';

@Injectable({ providedIn: 'root' })
export class NotasFacade {
  private readonly repo = inject(NotaApiRepository);

  readonly notas = signal<Nota[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly busqueda = signal('');
  
  // Opcional: estado para mantener en contexto la colección actual
  readonly idColeccionActiva = signal<number | null>(null);

  readonly notasFiltradas = computed(() => {
    const q = this.busqueda().toLowerCase();
    return this.notas().filter(n => 
      n.titulo.toLowerCase().includes(q) || 
      n.contenido.toLowerCase().includes(q)
    );
  });

  async cargarTodas(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const data = await this.repo.listarTodas();
      this.notas.set(data);
    } catch (e) {
      this.error.set('Error al cargar notas');
    } finally {
      this.cargando.set(false);
    }
  }

  async cargarPorColeccion(idColeccion: number): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    this.idColeccionActiva.set(idColeccion);
    try {
      const data = await this.repo.buscarEnColeccion(idColeccion, '');
      this.notas.set(data);
    } catch (e) {
      this.error.set('Error al cargar notas de la colección');
    } finally {
      this.cargando.set(false);
    }
  }

  async buscarEnColeccion(idColeccion: number, query: string): Promise<void> {
    this.cargando.set(true);
    try {
      const data = await this.repo.buscarEnColeccion(idColeccion, query);
      this.notas.set(data);
    } catch (e) {
      this.error.set('Error al buscar notas');
    } finally {
      this.cargando.set(false);
    }
  }

  private async recargarNotas(): Promise<void> {
    const colId = this.idColeccionActiva();
    if (colId) {
      await this.cargarPorColeccion(colId);
    } else {
      await this.cargarTodas();
    }
  }

  async crear(nota: Omit<Nota, 'id'>): Promise<void> {
    try {
      await this.repo.crear(nota);
      await this.recargarNotas();
    } catch (e) {
      this.error.set('Error al crear nota');
      throw e;
    }
  }

  async actualizar(id: number, nota: Omit<Nota, 'id'>): Promise<void> {
    try {
      await this.repo.actualizar(id, nota);
      await this.recargarNotas();
    } catch (e) {
      this.error.set('Error al actualizar nota');
      throw e;
    }
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.repo.eliminar(id);
      this.notas.update(list => list.filter(n => n.id !== id));
    } catch (e) {
      this.error.set('Error al eliminar nota');
      throw e;
    }
  }

  filtrarEnMemoria(query: string): void {
    this.busqueda.set(query);
  }
}
