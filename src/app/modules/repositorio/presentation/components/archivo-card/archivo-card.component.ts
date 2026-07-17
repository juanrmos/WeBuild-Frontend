import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Archivo } from '../../../domain/models/archivo.model';

@Component({
  selector: 'wb-archivo-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="archivo-card glass-panel">
      <div class="archivo-icon">
        <span class="icon">📄</span>
      </div>
      <div class="archivo-info">
        <h4 class="archivo-name" [title]="archivo().nombre">{{ archivo().nombre }}</h4>
        <div class="archivo-meta">
          <a [href]="archivo().url" target="_blank" class="link-download">Descargar / Ver</a>
          @if (archivo().notasAsociadas.length > 0) {
            <span class="badge">{{ archivo().notasAsociadas.length }} Notas</span>
          }
        </div>
      </div>
      <button class="wb-btn btn-icon btn-delete" (click)="onEliminar()" title="Eliminar">🗑️</button>
    </div>
  `,
  styles: [`
    .archivo-card {
      display: flex;
      align-items: center;
      padding: 1rem;
      gap: 1rem;
      transition: transform 0.2s;
      
      &:hover {
        transform: scale(1.02);
      }
    }
    .archivo-icon {
      font-size: 2rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem;
      border-radius: 8px;
    }
    .archivo-info {
      flex: 1;
      overflow: hidden;
    }
    .archivo-name {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .archivo-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.8rem;
    }
    .link-download {
      color: #60a5fa;
      text-decoration: none;
      
      &:hover { text-decoration: underline; }
    }
    .badge {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
    }
    .btn-icon {
      padding: 0.5rem;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-delete {
      background: rgba(239, 68, 68, 0.1);
      &:hover { background: rgba(239, 68, 68, 0.3); }
    }
  `]
})
export class ArchivoCardComponent {
  readonly archivo = input.required<Archivo>();
  readonly eliminado = output<number>();

  onEliminar(): void {
    this.eliminado.emit(this.archivo().id);
  }
}
