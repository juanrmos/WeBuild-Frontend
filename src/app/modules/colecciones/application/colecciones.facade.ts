import { Injectable, inject, signal, computed } from '@angular/core';
import { ColeccionApiRepository } from '../infrastructure/coleccion-api.repository';
import { Coleccion } from '../domain/models/coleccion.model';

@Injectable({ providedIn: 'root' })
export class ColeccionesFacade {
  private readonly repo = inject(ColeccionApiRepository);

  readonly colecciones = signal<Coleccion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly busqueda = signal('');

  readonly coleccionesFiltradas = computed(() => {
    const q = this.busqueda().toLowerCase();
    return this.colecciones().filter(c => c.nombre.toLowerCase().includes(q));
  });

  async cargarTodas(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const data = await this.repo.listar();
      this.colecciones.set(data);
    } catch (e) {
      this.error.set('Error al cargar las colecciones');
    } finally {
      this.cargando.set(false);
    }
  }

  async crear(nombre: string): Promise<void> {
    try {
      await this.repo.crear(nombre);
      await this.cargarTodas();
    } catch (e) {
      this.error.set('Error al crear colección');
      throw e;
    }
  }

  async actualizar(id: number, nombre: string): Promise<void> {
    try {
      await this.repo.actualizar(id, nombre);
      await this.cargarTodas();
    } catch (e) {
      this.error.set('Error al actualizar colección');
      throw e;
    }
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.repo.eliminar(id);
      this.colecciones.update(list => list.filter(c => c.id !== id));
    } catch (e) {
      this.error.set('Error al eliminar colección');
      throw e;
    }
  }

  buscar(query: string): void {
    this.busqueda.set(query);
  }
}
