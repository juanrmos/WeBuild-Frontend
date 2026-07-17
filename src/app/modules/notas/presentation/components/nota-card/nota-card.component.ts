import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Nota } from '@modules/notas/domain/models/nota.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wb-nota-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="note-card" (click)="onEditar()">
      <div class="card-header">
        <div class="collection-badge">
          <span class="dot" [style.background-color]="getColorForId(nota().idColeccionAsociada)"></span>
          <span class="collection-name">{{ nombreColeccion() }}</span>
        </div>
      </div>
      
      <div class="card-body">
        <h3 class="note-title">{{ nota().titulo }}</h3>
        <p class="note-preview">{{ getPreview() }}</p>
      </div>

      <div class="card-footer">
        <div class="spacer"></div>
        @if (nota().idArchivoAdjunto) {
          <div class="attachment-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            <span>1</span>
          </div>
        }
      </div>
      
      <!-- Eliminado provisional: El botón de eliminar se mostrará al hacer hover (si se requiere) o se manejará desde la vista detalle -->
      <button class="btn-delete" (click)="onEliminar($event)" title="Eliminar nota">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .note-card {
      background: #181818;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      cursor: pointer;
      position: relative;
      transition: border-color 0.2s, transform 0.2s;
      height: 100%;
      min-height: 180px;

      &:hover {
        border-color: #444;
        transform: translateY(-2px);
        
        .btn-delete {
          opacity: 1;
        }
      }
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .collection-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #cccccc;
    }
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .note-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.3;
    }

    .note-preview {
      margin: 0;
      font-size: 0.9rem;
      color: #888888;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      align-items: center;
      margin-top: auto;
    }

    .spacer {
      flex: 1;
    }

    .attachment-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #888888;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .btn-delete {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: none;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s, background 0.2s;
      
      &:hover {
        background: rgba(239, 68, 68, 0.2);
      }
    }
  `]
})
export class NotaCardComponent {
  readonly nota = input.required<Nota>();
  readonly nombreColeccion = input<string>('Colección');
  readonly editado = output<Nota>();
  readonly eliminado = output<number>();

  // Misma paleta de colores del layout
  private readonly colores = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'
  ];

  getColorForId(id: number): string {
    return this.colores[id % this.colores.length];
  }

  getPreview(): string {
    const contenido = this.nota().contenido;
    if (!contenido) return 'Sin contenido adicional.';
    // Remover tags HTML si los hay para el preview
    return contenido.replace(/<[^>]*>?/gm, '').substring(0, 150) + (contenido.length > 150 ? '...' : '');
  }

  onEditar(): void {
    this.editado.emit(this.nota());
  }

  onEliminar(event: Event): void {
    event.stopPropagation();
    this.eliminado.emit(this.nota().id);
  }
}
