import { Component, ChangeDetectionStrategy, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'wb-prompt-dialog',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="onCancel()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <h3 class="title">{{ title() }}</h3>
        
        <input 
          type="text" 
          [ngModel]="value()" 
          (ngModelChange)="value.set($event)"
          [placeholder]="placeholder()"
          class="prompt-input"
          (keyup.enter)="onConfirm()"
          autofocus
        />
        
        <div class="actions">
          <button class="btn-cancel" (click)="onCancel()">Cancelar</button>
          <button class="btn-confirm" (click)="onConfirm()">Aceptar</button>
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
      margin: 0 0 1rem;
      font-size: 1.15rem;
      color: #ffffff;
      font-weight: 600;
    }

    .prompt-input {
      width: 100%;
      background: #121212;
      border: 1px solid #333333;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #ffffff;
      font-size: 0.95rem;
      outline: none;
      margin-bottom: 1.5rem;
      box-sizing: border-box;

      &:focus {
        border-color: #555555;
      }
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
      background: #eeeeee;
      border: none;
      color: #000000;
      
      &:hover {
        background: #ffffff;
      }
    }
  `]
})
export class PromptDialogComponent implements OnInit {
  readonly title = input<string>('Renombrar');
  readonly initialValue = input<string>('');
  readonly placeholder = input<string>('');
  
  readonly confirmed = output<string>();
  readonly cancelled = output<void>();

  readonly value = signal<string>('');

  ngOnInit() {
    this.value.set(this.initialValue());
  }

  onConfirm(): void {
    this.confirmed.emit(this.value());
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
