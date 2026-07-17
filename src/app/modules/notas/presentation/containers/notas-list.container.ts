import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { NotasFacade } from '@modules/notas/application/notas.facade';
import { CommonModule } from '@angular/common';
import { NotaCardComponent } from '../components/nota-card/nota-card.component';
import { NotaFormComponent } from '../components/nota-form/nota-form.component';
import { Nota } from '@modules/notas/domain/models/nota.model';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColeccionesFacade } from '@modules/colecciones/application/colecciones.facade';
import { RepositorioFacade } from '@modules/repositorio/application/repositorio.facade';

import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'wb-notas-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NotaCardComponent, NotaFormComponent, ConfirmDialogComponent],
  template: `
    <div class="content-wrapper">
      @if (!mostrandoFormulario()) {
        <div class="content-header">
          <div class="header-titles">
            <h2>All resources</h2>
            <span class="count">{{ filteredNotes().length }} notes</span>
          </div>
          
          <div class="header-actions">
            <button class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="14" rx="1"/>
                <rect width="7" height="7" x="3" y="14" rx="1"/>
              </svg>
            </button>
            <button class="btn-new" (click)="nuevaNota()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/><path d="M12 5v14"/>
              </svg>
              New note
            </button>
          </div>
        </div>

        <div class="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" placeholder="Search notes and collections" (input)="onSearch($event)" />
        </div>

        <div class="notes-grid">
          @if (facade.cargando()) {
            <div class="loading">Loading notes...</div>
          } @else {
            @for (nota of filteredNotes(); track nota.id) {
              <wb-nota-card 
                [nota]="nota" 
                [nombreColeccion]="getCollectionName(nota.idColeccionAsociada)"
                (editado)="onEditar($event)" 
                (eliminado)="onEliminar($event)" 
              />
            }
          }
        </div>
      } @else {
        <!-- Editor a Pantalla Completa (Full-Screen) -->
        <wb-nota-form 
          [nota]="notaSeleccionada()"
          [cargando]="facade.cargando()"
          [colecciones]="coleccionesFacade.colecciones()"
          [archivos]="repositorioFacade.archivos()"
          [defaultCollectionId]="activeCollectionId() || 1"
          [coleccionColor]="currentCollectionColor()"
          (guardado)="onGuardar($event)"
          (cancelado)="cerrarFormulario()"
        />
      }

      @if (notaAEliminar() !== null) {
        <wb-confirm-dialog
          title="Eliminar Nota"
          message="¿Estás seguro de que deseas eliminar esta nota? Esta acción no se puede deshacer."
          (confirmed)="confirmarEliminacion()"
          (cancelled)="cancelarEliminacion()"
        />
      }
    </div>
  `,
  styles: [`
    .content-wrapper {
      padding: 2rem 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: 100%;
      overflow-y: auto;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .header-titles {
      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: #ffffff;
      }
      .count {
        font-size: 0.9rem;
        color: #888888;
        font-weight: 500;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-icon {
      background: none;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #888888;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      
      &:hover {
        color: #ffffff;
        background: #1a1a1a;
      }
    }

    .btn-new {
      background: #eeeeee;
      color: #000000;
      border: none;
      border-radius: 24px;
      padding: 0.5rem 1rem;
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: #ffffff;
      }
    }

    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
      
      svg {
        position: absolute;
        left: 14px;
        color: #888888;
      }
      input {
        width: 100%;
        background-color: #181818;
        border: 1px solid #2a2a2a;
        color: #ffffff;
        border-radius: 24px;
        padding: 0.8rem 1.5rem 0.8rem 2.5rem;
        font-size: 1rem;
        outline: none;
        
        &::placeholder {
          color: #555555;
        }
        &:focus {
          border-color: #555;
        }
      }
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .loading {
      color: #888888;
      padding: 2rem 0;
      grid-column: 1 / -1;
    }
  `]
})
export class NotasListContainer implements OnInit {
  protected readonly facade = inject(NotasFacade);
  protected readonly coleccionesFacade = inject(ColeccionesFacade);
  protected readonly repositorioFacade = inject(RepositorioFacade);
  private readonly route = inject(ActivatedRoute);
  
  mostrandoFormulario = signal(false);
  notaSeleccionada = signal<Nota | null>(null);
  activeCollectionId = signal<number | null>(null);
  notaAEliminar = signal<number | null>(null);

  // Misma paleta de colores del layout (simplificado)
  private readonly colores = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  readonly filteredNotes = computed(() => {
    const notas = this.facade.notasFiltradas();
    const active = this.activeCollectionId();
    if (active) {
      return notas.filter(n => n.idColeccionAsociada === active);
    }
    return notas;
  });

  readonly currentCollectionName = computed(() => {
    const colId = this.notaSeleccionada()?.idColeccionAsociada || this.activeCollectionId() || 1;
    const col = this.coleccionesFacade.colecciones().find(c => c.id === colId);
    return col ? col.nombre : `Colección ${colId}`;
  });

  readonly currentCollectionColor = computed(() => {
    const colId = this.notaSeleccionada()?.idColeccionAsociada || this.activeCollectionId() || 1;
    return this.colores[colId % this.colores.length];
  });

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['collection']) {
        this.activeCollectionId.set(Number(params['collection']));
      } else {
        this.activeCollectionId.set(null);
      }
    });
  }

  ngOnInit() {
    this.facade.cargarTodas();
    // Asegurarnos de que las colecciones estén cargadas para obtener su nombre
    if (!this.coleccionesFacade.colecciones().length) {
      this.coleccionesFacade.cargarTodas();
    }
    
    // Asegurarnos de que los archivos estén cargados para el combobox
    if (!this.repositorioFacade.archivos().length) {
      this.repositorioFacade.cargarTodos();
    }
  }

  getCollectionName(id: number): string {
    const col = this.coleccionesFacade.colecciones().find(c => c.id === id);
    return col ? col.nombre : `Colección ${id}`;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.facade.filtrarEnMemoria(input.value);
  }

  nuevaNota(): void {
    this.notaSeleccionada.set(null);
    this.mostrandoFormulario.set(true);
  }

  onEditar(nota: Nota): void {
    this.notaSeleccionada.set(nota);
    this.mostrandoFormulario.set(true);
  }

  onEliminar(id: number): void {
    this.notaAEliminar.set(id);
  }

  confirmarEliminacion(): void {
    const id = this.notaAEliminar();
    if (id !== null) {
      this.facade.eliminar(id);
      this.notaAEliminar.set(null);
    }
  }

  cancelarEliminacion(): void {
    this.notaAEliminar.set(null);
  }

  onGuardar(data: Partial<Nota>): void {
    const payload = {
      titulo: data.titulo || 'Untitled Note',
      contenido: data.contenido || '',
      idColeccionAsociada: data.idColeccionAsociada || this.activeCollectionId() || 1,
      idArchivoAdjunto: data.idArchivoAdjunto
    };

    const sel = this.notaSeleccionada();
    if (sel) {
      this.facade.actualizar(sel.id, payload);
    } else {
      this.facade.crear(payload);
    }
    this.cerrarFormulario();
  }

  cerrarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.notaSeleccionada.set(null);
  }
}
