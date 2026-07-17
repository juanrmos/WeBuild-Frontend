import { Component, ChangeDetectionStrategy, output, signal, input } from '@angular/core';

@Component({
  selector: 'wb-archivo-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="upload-zone glass-panel" 
      [class.dragover]="isDragover()"
      [class.uploading]="cargando()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input 
        #fileInput 
        type="file" 
        accept="application/pdf" 
        style="display: none;" 
        (change)="onFileChange($event)"
      />
      
      @if (cargando()) {
        <div class="upload-content">
          <div class="spinner"></div>
          <p>Subiendo archivo...</p>
        </div>
      } @else {
        <div class="upload-content">
          <span class="upload-icon">📤</span>
          <h3>Arrastra tu PDF aquí</h3>
          <p>o haz clic para explorar tus archivos</p>
          <span class="format-hint">Solo archivos .pdf</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .upload-zone {
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 2rem;
      
      &:hover, &.dragover {
        border-color: #60a5fa;
        background: rgba(59, 130, 246, 0.1);
      }
      &.uploading {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      
      h3 { margin: 0; }
      p { margin: 0; color: var(--wb-text-secondary); }
    }
    .upload-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    .format-hint {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 0.5rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-left-color: #60a5fa;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ArchivoUploadComponent {
  readonly cargando = input<boolean>(false);
  readonly archivoSeleccionado = output<File>();
  
  readonly isDragover = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragover.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragover.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragover.set(false);
    
    if (this.cargando()) return;
    
    const file = event.dataTransfer?.files[0];
    this.validarYEmitir(file);
  }

  onFileChange(event: Event): void {
    if (this.cargando()) return;
    
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.validarYEmitir(file);
    // Limpiar input para permitir subir el mismo archivo de nuevo si falló
    input.value = '';
  }

  private validarYEmitir(file?: File): void {
    if (file && file.type === 'application/pdf') {
      this.archivoSeleccionado.emit(file);
    } else if (file) {
      alert('Solo se permiten archivos PDF.');
    }
  }
}
