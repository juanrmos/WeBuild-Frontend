import { Component, ChangeDetectionStrategy, inject, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { RepositorioFacade } from '@modules/repositorio/application/repositorio.facade';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PromptDialogComponent } from '@shared/components/prompt-dialog/prompt-dialog.component';

@Component({
  selector: 'wb-repositorio-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PromptDialogComponent],
  template: `
    <div class="modal-backdrop">
      <div class="repo-modal">
        <header class="modal-header">
          <div class="header-text">
            <h2>Document repository</h2>
            <p>Manage your uploaded material — rename or remove documents.</p>
          </div>
          <button class="btn-close" (click)="onClose()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </header>

        <div class="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search material" 
            (input)="onSearch($event)"
          />
        </div>

        <div class="file-list">
          @if (facade.cargando() && !facade.archivos().length) {
            <div class="empty-state">Loading documents...</div>
          } @else if (facade.archivosFiltrados().length === 0) {
            <div class="empty-state">No documents found.</div>
          } @else {
            @for (file of facade.archivosFiltrados(); track file.id) {
              <div class="file-item">
                <div class="file-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div class="file-info">
                  <span class="file-name">{{ file.nombre }}</span>
                  <span class="file-meta">added {{ file.fechaCreacion | date:'MMM dd, yyyy' }}</span>
                </div>
                <div class="file-actions">
                  <button class="action-btn" title="Rename" (click)="onRename(file.id, file.nombre)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                    </svg>
                  </button>
                  <button class="action-btn" title="Delete" (click)="onDelete(file.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            }
          }
        </div>

        <footer class="modal-footer">
          <input 
            type="file" 
            #fileInput 
            hidden 
            accept="application/pdf"
            (change)="onFileSelected($event)"
          />
          <button class="btn-upload" (click)="fileInput.click()" [disabled]="facade.subiendo()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
            </svg>
            {{ facade.subiendo() ? 'Uploading...' : 'Upload new' }}
          </button>
          
          <button class="btn-done" (click)="onClose()">Done</button>
        </footer>
      </div>

      @if (archivoARenombrar()) {
        <wb-prompt-dialog
          title="Renombrar archivo a:"
          [initialValue]="archivoARenombrar()?.nombre || ''"
          (confirmed)="confirmarRenombre($event)"
          (cancelled)="cancelarRenombre()"
        />
      }
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
      padding: 2rem;
    }

    .repo-modal {
      background: #1c1c1c;
      border: 1px solid #333333;
      border-radius: 16px;
      width: 100%;
      max-width: 650px;
      height: 80vh;
      max-height: 800px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem 1.5rem 1rem;
    }

    .header-text {
      h2 {
        color: #ffffff;
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
      }
      p {
        color: #888888;
        font-size: 0.9rem;
        margin: 0;
      }
    }

    .btn-close {
      background: none;
      border: none;
      color: #888888;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      
      &:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .search-bar {
      position: relative;
      padding: 0 1.5rem;
      margin-bottom: 1.5rem;
      
      svg {
        position: absolute;
        left: 2.25rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666666;
      }
      
      input {
        width: 100%;
        background: #121212;
        border: 1px solid #333333;
        border-radius: 24px;
        padding: 0.6rem 1rem 0.6rem 2.5rem;
        color: #ffffff;
        font-size: 0.9rem;
        outline: none;
        
        &::placeholder { color: #666666; }
        &:focus { border-color: #555555; }
      }
    }

    .file-list {
      flex: 1;
      overflow-y: auto;
      padding: 0 0.5rem 0 1.5rem;
      margin-right: 0.5rem; /* Space for scrollbar */
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      /* Custom Scrollbar */
      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb { 
        background: #333333; 
        border-radius: 10px; 
      }
      &::-webkit-scrollbar-thumb:hover { background: #555555; }
    }

    .empty-state {
      text-align: center;
      color: #666666;
      padding: 3rem 1rem;
      font-size: 0.9rem;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      transition: background 0.2s;
      
      &:hover {
        background: #252525;
        
        .action-btn { opacity: 1; }
      }
    }

    .file-icon {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      padding: 0.6rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .file-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .file-name {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-meta {
      color: #888888;
      font-size: 0.8rem;
    }

    .file-actions {
      display: flex;
      gap: 0.25rem;
    }

    .action-btn {
      background: none;
      border: none;
      color: #888888;
      cursor: pointer;
      padding: 0.4rem;
      border-radius: 6px;
      opacity: 0;
      transition: opacity 0.2s, background 0.2s, color 0.2s;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-top: 1px solid #2a2a2a;
      margin-top: 1rem;
    }

    .btn-upload {
      background: none;
      border: none;
      color: #cccccc;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      cursor: pointer;
      padding: 0.5rem;
      
      &:hover { color: #ffffff; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .btn-done {
      background: #eeeeee;
      color: #000000;
      border: none;
      border-radius: 20px;
      padding: 0.5rem 1.25rem;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      
      &:hover { background: #ffffff; }
    }
  `]
})
export class RepositorioContainer implements OnInit {
  protected readonly facade = inject(RepositorioFacade);
  private readonly router = inject(Router);

  archivoARenombrar = signal<{id: number, nombre: string} | null>(null);

  ngOnInit(): void {
    this.facade.cargarTodos();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.facade.buscar(input.value);
  }

  onClose(): void {
    this.router.navigate(['/notas']);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      await this.facade.subir(file);
      // Limpiar input para permitir subir el mismo archivo si es necesario
      input.value = '';
    }
  }

  onRename(id: number, nombreActual: string): void {
    this.archivoARenombrar.set({ id, nombre: nombreActual });
  }

  async confirmarRenombre(nuevoNombre: string): Promise<void> {
    const target = this.archivoARenombrar();
    if (target && nuevoNombre && nuevoNombre !== target.nombre) {
      await this.facade.renombrar(target.id, nuevoNombre);
    }
    this.archivoARenombrar.set(null);
  }

  cancelarRenombre(): void {
    this.archivoARenombrar.set(null);
  }

  async onDelete(id: number): Promise<void> {
    if (confirm('¿Estás seguro de eliminar este archivo permanentemente?')) {
      await this.facade.eliminar(id);
    }
  }
}
