import { Component, ChangeDetectionStrategy, input, output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Nota } from '@modules/notas/domain/models/nota.model';
import { Coleccion } from '@modules/colecciones/domain/models/coleccion.model';
import { Archivo } from '@modules/repositorio/domain/models/archivo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wb-nota-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="editor-container">
      <div class="editor-header">
        <div class="header-left">
          <button type="button" class="btn-back" (click)="onBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Notes
          </button>
          
          <div class="collection-badge custom-select-container">
            <span class="dot" [style.background-color]="coleccionColor()"></span>
            <div class="custom-select-trigger" (click)="toggleDropdown()">
              {{ getSelectedCollectionName() }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-arrow">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            
            @if (dropdownOpen) {
              <ul class="custom-options-list">
                @for (col of colecciones(); track col.id) {
                  <li (click)="selectCollection(col.id)" [class.active]="form.get('idColeccionAsociada')?.value === col.id">
                    {{ col.nombre }}
                  </li>
                }
              </ul>
            }
          </div>
        </div>

        <div class="header-right">
          <button type="button" class="btn-save" [disabled]="!form.valid || cargando()" (click)="onSave()">
            {{ cargando() ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" class="btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="editor-content">
        <input 
          type="text" 
          formControlName="titulo" 
          class="title-input" 
          placeholder="Note title"
        />
        
        <p class="last-edited">Last edited just now</p>

        <textarea 
          formControlName="contenido" 
          class="body-input" 
          placeholder="Start writing..."
        ></textarea>
      </div>

      <div class="attachments-section">
        <div class="attachments-card">
          <div class="card-header">
            <div class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
              Attached Files <span class="badge">{{ nota()?.idArchivoAdjunto ? '1' : '0' }}</span>
            </div>
            <div class="custom-select-container">
              <button type="button" class="btn-link" (click)="togglePdfDropdown()">
                {{ form.get('idArchivoAdjunto')?.value ? 'Change PDF' : '+ Link PDF' }}
              </button>
              
              @if (pdfDropdownOpen) {
                <ul class="custom-options-list" style="right: 0; left: auto; min-width: 220px; max-height: 250px; overflow-y: auto;">
                  <li (click)="selectPdf(null)">-- Sin PDF --</li>
                  @for (arch of archivos(); track arch.id) {
                    <li (click)="selectPdf(arch.id)" [class.active]="form.get('idArchivoAdjunto')?.value === arch.id">
                      {{ arch.nombre }}
                    </li>
                  }
                </ul>
              }
            </div>
          </div>

          @if (form.get('idArchivoAdjunto')?.value) {
            <div class="pdf-item">
              <div class="pdf-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div class="pdf-info">
                <span class="pdf-name">{{ getSelectedPdfName() }}</span>
                <span class="pdf-meta">PDF</span>
              </div>
              <button type="button" class="btn-remove" (click)="selectPdf(null)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          }
        </div>
      </div>
    </form>
  `,
  styles: [`
    .editor-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .btn-back {
      background: none;
      border: none;
      color: #888888;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
      padding: 0;

      &:hover { color: #ffffff; }
    }

    .collection-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #1e1e1e;
      padding: 0.35rem 0.75rem;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 500;
      color: #cccccc;
    }
    
    .custom-select-container {
      position: relative;
      cursor: pointer;
      user-select: none;
    }
    
    .custom-select-trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #cccccc;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .dropdown-arrow {
      color: #888;
    }
    
    .custom-options-list {
      position: absolute;
      top: 120%;
      left: 0;
      background: #1e1e1e;
      border: 1px solid #333333;
      border-radius: 12px;
      padding: 0.5rem 0;
      margin: 0;
      list-style: none;
      min-width: 150px;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      
      li {
        padding: 0.5rem 1rem;
        color: #cccccc;
        font-size: 0.85rem;
        cursor: pointer;
        transition: background 0.2s;
        
        &:hover {
          background: #2a2a2a;
          color: #ffffff;
        }
        
        &.active {
          color: #3b82f6;
          font-weight: 600;
        }
      }
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-save {
      background: #eeeeee;
      color: #000000;
      border: none;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: #ffffff;
      }
      
      &:disabled {
        background: #333333;
        color: #666666;
        cursor: not-allowed;
      }
    }

    .btn-icon {
      background: none;
      border: none;
      color: #888888;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;

      &:hover { color: #ffffff; }
    }

    .editor-content {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .title-input {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 2.5rem;
      font-weight: 700;
      outline: none;
      margin-bottom: 0.5rem;
      font-family: inherit;
      width: 100%;

      &::placeholder {
        color: #444444;
      }
    }

    .last-edited {
      color: #666666;
      font-size: 0.9rem;
      margin: 0 0 2rem 0;
    }

    .body-input {
      background: transparent;
      border: none;
      color: #dddddd;
      font-size: 1.1rem;
      line-height: 1.7;
      outline: none;
      flex: 1;
      resize: none;
      font-family: inherit;
      min-height: 300px;

      &::placeholder {
        color: #444444;
      }
    }

    .attachments-section {
      margin-top: 3rem;
    }

    .attachments-card {
      background: #181818;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      padding: 1.25rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.95rem;

      .badge {
        background: #2a2a2a;
        color: #aaaaaa;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
      }
    }

    .btn-link {
      background: transparent;
      border: 1px solid #333333;
      color: #cccccc;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      cursor: pointer;

      &:hover {
        background: #2a2a2a;
        color: #ffffff;
      }
    }

    .pdf-item {
      display: flex;
      align-items: center;
      background: #121212;
      border: 1px solid #2a2a2a;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      gap: 1rem;
    }

    .pdf-icon {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      padding: 0.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pdf-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .pdf-name {
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .pdf-meta {
      color: #888888;
      font-size: 0.8rem;
    }

    .btn-remove {
      background: none;
      border: none;
      color: #666666;
      cursor: pointer;
      padding: 0.5rem;

      &:hover {
        color: #ef4444;
      }
    }
  `]
})
export class NotaFormComponent implements OnInit {
  readonly nota = input<Nota | null>(null);
  readonly cargando = input<boolean>(false);
  readonly colecciones = input<Coleccion[]>([]);
  readonly archivos = input<Archivo[]>([]);
  readonly defaultCollectionId = input<number>(1);
  
  readonly coleccionActual = input<string>('Colección');
  readonly coleccionColor = input<string>('#3b82f6');
  
  readonly guardado = output<Partial<Nota>>();
  readonly cancelado = output<void>();

  form: FormGroup;
  dropdownOpen = false;
  pdfDropdownOpen = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      contenido: [''],
      idColeccionAsociada: [1, Validators.required],
      idArchivoAdjunto: [null]
    });
  }

  ngOnInit(): void {
    const notaActual = this.nota();
    if (notaActual) {
      this.form.patchValue({
        titulo: notaActual.titulo,
        contenido: notaActual.contenido,
        idColeccionAsociada: notaActual.idColeccionAsociada,
        idArchivoAdjunto: notaActual.idArchivoAdjunto || null
      });
    } else {
      this.form.patchValue({
        idColeccionAsociada: this.defaultCollectionId()
      });
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.pdfDropdownOpen = false;
  }

  togglePdfDropdown(): void {
    this.pdfDropdownOpen = !this.pdfDropdownOpen;
    this.dropdownOpen = false;
  }

  selectCollection(id: number): void {
    this.form.patchValue({ idColeccionAsociada: id });
    this.dropdownOpen = false;
  }

  selectPdf(id: number | null): void {
    this.form.patchValue({ idArchivoAdjunto: id });
    this.pdfDropdownOpen = false;
  }

  getSelectedCollectionName(): string {
    const id = this.form.get('idColeccionAsociada')?.value;
    const col = this.colecciones().find(c => c.id === id);
    return col ? col.nombre : 'Colección';
  }

  getSelectedPdfName(): string {
    const id = this.form.get('idArchivoAdjunto')?.value;
    if (!id) return '';
    const file = this.archivos().find(a => a.id === id);
    return file ? file.nombre : `File_${id}.pdf`;
  }

  onSave(): void {
    if (this.form.valid) {
      this.guardado.emit({
        ...this.form.value
      });
    }
  }

  onBack(): void {
    this.cancelado.emit();
  }
}
