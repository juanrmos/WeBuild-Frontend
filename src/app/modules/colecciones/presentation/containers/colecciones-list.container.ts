import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ColeccionesFacade } from '../../application/colecciones.facade';
import { ColeccionCardComponent } from '../components/coleccion-card/coleccion-card.component';
import { ColeccionFormComponent } from '../components/coleccion-form/coleccion-form.component';
import { Coleccion } from '../../domain/models/coleccion.model';

@Component({
  selector: 'wb-colecciones-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColeccionCardComponent, ColeccionFormComponent],
  template: `
    <div class="colecciones-layout">
      <header class="header">
        <h2>Gestión de Colecciones</h2>
        <div class="search-box">
          <input 
            type="text" 
            class="wb-input" 
            placeholder="Buscar colección..." 
            (input)="onSearch($event)"
          />
        </div>
      </header>
      
      @if (facade.error()) {
        <div class="error-banner">{{ facade.error() }}</div>
      }

      <wb-coleccion-form 
        [cargando]="facade.cargando()"
        [coleccionEditar]="coleccionEnEdicion()"
        (guardado)="onGuardar($event)"
        (cancelado)="onCancelar()"
      />

      @if (facade.cargando() && !facade.colecciones().length) {
        <div class="loading">Cargando colecciones...</div>
      } @else {
        <div class="grid">
          @for (item of facade.coleccionesFiltradas(); track item.id) {
            <wb-coleccion-card 
              [coleccion]="item"
              (editado)="onEditar($event)"
              (eliminado)="onEliminar($event)"
            />
          } @empty {
            <div class="empty-state">No se encontraron colecciones.</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .colecciones-layout {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      h2 { margin: 0; }
    }
    .search-box {
      width: 300px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .empty-state, .loading {
      text-align: center;
      padding: 3rem;
      color: var(--wb-text-muted);
      grid-column: 1 / -1;
    }
  `]
})
export class ColeccionesListContainer implements OnInit {
  protected readonly facade = inject(ColeccionesFacade);
  
  readonly coleccionEnEdicion = signal<Coleccion | null>(null);

  ngOnInit(): void {
    this.facade.cargarTodas();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.facade.buscar(input.value);
  }

  async onGuardar(data: { id?: number; nombre: string }): Promise<void> {
    if (data.id) {
      await this.facade.actualizar(data.id, data.nombre);
    } else {
      await this.facade.crear(data.nombre);
    }
    this.coleccionEnEdicion.set(null);
  }

  onEditar(coleccion: Coleccion): void {
    this.coleccionEnEdicion.set(coleccion);
  }

  onCancelar(): void {
    this.coleccionEnEdicion.set(null);
  }

  async onEliminar(id: number): Promise<void> {
    if (confirm('¿Estás seguro de eliminar esta colección?')) {
      await this.facade.eliminar(id);
    }
  }
}
