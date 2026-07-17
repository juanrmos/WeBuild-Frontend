import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'wb-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="onCancel()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <h3 class="title">{{ title() }}</h3>
        <p class="message">{{ message() }}</p>
        
        <div class="actions">
          <button class="btn-cancel" (click)="onCancel()">Cancelar</button>
          <button class="btn-confirm" (click)="onConfirm()">Eliminar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    .dialog {
      background: #181818;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .title {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      color: #ffffff;
      font-weight: 600;
    }
    
    .message {
      margin: 0 0 1.5rem;
      color: #888888;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    
    button {
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-cancel {
      background: transparent;
      border: 1px solid #333333;
      color: #cccccc;
      
      &:hover {
        background: #2a2a2a;
        color: #ffffff;
      }
    }
    
    .btn-confirm {
      background: #ef4444;
      border: none;
      color: #ffffff;
      
      &:hover {
        background: #dc2626;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  readonly title = input<string>('Confirmar acción');
  readonly message = input<string>('¿Estás seguro?');
  
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
