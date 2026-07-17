import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Coleccion } from '../../../domain/models/coleccion.model';

@Component({
  selector: 'wb-coleccion-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="coleccion-card glass-panel">
      <div class="coleccion-content">
        <h3 class="coleccion-title">{{ coleccion().nombre }}</h3>
        <p class="coleccion-id">ID: {{ coleccion().id }}</p>
      </div>
      <div class="coleccion-actions">
        <button class="wb-btn btn-edit" (click)="onEditar()">Editar</button>
        <button class="wb-btn btn-delete" (click)="onEliminar()">Eliminar</button>
      </div>
    </div>
  `,
  styles: [`
    .coleccion-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      justify-content: space-between;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: translateY(-4px);
      }
    }
    .coleccion-title {
      margin: 0 0 0.25rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .coleccion-id {
      margin: 0;
      font-size: 0.85rem;
      color: var(--wb-text-muted);
    }
    .coleccion-actions {
      display: flex;
      gap: 0.5rem;
      
      .wb-btn {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        flex: 1;
      }
      .btn-edit {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        &:hover { background: rgba(59, 130, 246, 0.3); }
      }
      .btn-delete {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        &:hover { background: rgba(239, 68, 68, 0.3); }
      }
    }
  `]
})
export class ColeccionCardComponent {
  readonly coleccion = input.required<Coleccion>();
  readonly editado = output<Coleccion>();
  readonly eliminado = output<number>();

  onEditar(): void {
    this.editado.emit(this.coleccion());
  }

  onEliminar(): void {
    this.eliminado.emit(this.coleccion().id);
  }
}
