import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ColeccionesFacade } from '@modules/colecciones/application/colecciones.facade';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wb-main-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 6h4"/>
              <path d="M2 10h4"/>
              <path d="M2 14h4"/>
              <path d="M2 18h4"/>
              <rect width="16" height="20" x="4" y="2" rx="2"/>
              <path d="M16 2v20"/>
            </svg>
            <span>Slate</span>
          </div>
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" placeholder="Search collections" />
            <span class="shortcut">⌘K</span>
          </div>
        </div>

        <div class="sidebar-section collections-section">
          <div class="section-title">
            <span>COLLECTIONS</span>
            <button class="btn-icon" title="New Collection" (click)="addCollection()">+</button>
          </div>
          
          <div class="collections-list">
            <a routerLink="/notas" class="nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <div class="nav-item-content">
                <span class="dot" style="background-color: #3b82f6;"></span>
                <span class="col-name">All Notes</span>
              </div>
            </a>

            @if (isCreatingCollection()) {
              <div class="nav-item">
                <div class="nav-item-content">
                  <span class="dot" style="background-color: #888888;"></span>
                  <input 
                    type="text" 
                    class="edit-input" 
                    placeholder="New collection..."
                    #newColInput
                    (keydown.enter)="saveNew(newColInput.value)"
                    (keydown.escape)="cancelNew()"
                    autofocus 
                  />
                </div>
                <div class="nav-item-actions inline-actions">
                  <button class="action-btn" title="Save" (click)="saveNew(newColInput.value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <button class="action-btn" title="Cancel" (click)="cancelNew()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            }
            
            @if (coleccionesFacade.cargando()) {
              <div class="loading-text">Cargando...</div>
            } @else {
              @for (col of coleccionesFacade.colecciones(); track col.id) {
                <a [routerLink]="['/notas']" [queryParams]="{ collection: col.id }" class="nav-item" routerLinkActive="active">
                  <div class="nav-item-content">
                    <span class="dot" [style.background-color]="getColorForId(col.id)"></span>
                    
                    @if (editingCollectionId === col.id) {
                      <input 
                        type="text" 
                        class="edit-input" 
                        [value]="col.nombre" 
                        (click)="$event.preventDefault(); $event.stopPropagation()"
                        (keydown.enter)="saveEdit(col.id, $event)"
                        (blur)="cancelEdit()"
                        autofocus 
                      />
                    } @else {
                      <span class="col-name">{{ col.nombre }}</span>
                    }
                  </div>
                  
                  @if (editingCollectionId !== col.id) {
                    <div class="nav-item-actions" (click)="$event.preventDefault(); $event.stopPropagation()">
                      <button class="action-btn" title="Rename" (click)="startEdit(col.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                        </svg>
                      </button>
                      <button class="action-btn" title="Delete" (click)="deleteCollection(col.id, col.nombre)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  }
                </a>
              }
            }
          </div>
        </div>

        <div class="sidebar-section library-section">
          <div class="section-title">
            <span>LIBRARY</span>
          </div>
          <a routerLink="/repositorio" class="nav-item" routerLinkActive="active">
            <div class="nav-item-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>Document repository</span>
            </div>
          </a>
        </div>

        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="avatar">{{ getInitials() }}</div>
            <div class="user-info">
              <span class="name">{{ auth.usuarioActual()?.nombre || 'Alex Rivera' }}</span>
              <span class="email">{{ auth.usuarioActual()?.email || 'alex@slate.app' }}</span>
            </div>
            <button class="btn-icon settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      width: 100vw;
      background-color: #111111;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
    }
    
    /* SIDEBAR */
    .sidebar {
      width: 280px;
      background-color: #1a1a1a;
      border-right: 1px solid #2a2a2a;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .sidebar-header {
      padding: 1.5rem 1.25rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      
      svg {
        background: #eeeeee;
        color: #000000;
        border-radius: 8px;
        padding: 4px;
      }
    }
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      
      svg {
        position: absolute;
        left: 10px;
        color: #888888;
      }
      input {
        width: 100%;
        background-color: #0a0a0a;
        border: 1px solid #2a2a2a;
        color: #ffffff;
        border-radius: 8px;
        padding: 0.6rem 2.5rem 0.6rem 2rem;
        font-size: 0.9rem;
        outline: none;
        
        &::placeholder {
          color: #555555;
        }
        &:focus {
          border-color: #555;
        }
      }
      .shortcut {
        position: absolute;
        right: 10px;
        background: #2a2a2a;
        color: #888888;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
      }
    }

    /* SECTIONS */
    .sidebar-section {
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
    }
    .collections-section {
      flex: 1; /* Ocupa el espacio restante */
      min-height: 0; /* Necesario para que el flex-child scrollee correctamente */
      display: flex;
      flex-direction: column;
    }
    .collections-list {
      flex: 1;
      overflow-y: auto; /* SCROLL SOLUCION: barra interna si hay +100 */
      padding: 0 0.5rem;
      
      /* Scrollbar minimalista */
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 4px;
      }
    }
    .library-section {
      padding: 0.5rem;
    }

    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #888888;
      letter-spacing: 0.05em;
      padding: 0 1.25rem 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-icon {
      background: none;
      border: none;
      color: #888888;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        color: #ffffff;
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      color: #cccccc;
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 2px;
      
      &:hover {
        background-color: #2a2a2a;
        color: #ffffff;

        .nav-item-actions {
          opacity: 1;
        }
      }
      &.active {
        background-color: #2a2a2a;
        color: #ffffff;
      }
    }
    .nav-item-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      overflow: hidden;
    }
    .col-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .edit-input {
      background: #0a0a0a;
      border: 1px solid #3b82f6;
      color: #ffffff;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.9rem;
      outline: none;
      width: 100%;
    }
    .nav-item-actions {
      display: flex;
      gap: 2px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .inline-actions {
      opacity: 1 !important;
    }
    .action-btn {
      background: none;
      border: none;
      color: #888888;
      cursor: pointer;
      padding: 0.2rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* FOOTER */
    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid #2a2a2a;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar {
      width: 32px;
      height: 32px;
      background-color: #eeeeee;
      color: #000000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      
      .name {
        font-size: 0.9rem;
        font-weight: 600;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .email {
        font-size: 0.75rem;
        color: #888888;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .settings {
      color: #888888;
      &:hover { color: #ffffff; }
    }
    .loading-text {
      padding: 1rem;
      color: #888888;
      font-size: 0.85rem;
      text-align: center;
    }

    /* MAIN CONTENT */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  protected readonly coleccionesFacade = inject(ColeccionesFacade);
  protected readonly auth = inject(AuthService);

  editingCollectionId: number | null = null;
  isCreatingCollection = signal(false);

  // Paleta de colores vibrantes para las colecciones
  private readonly colores = [
    '#3b82f6', // azul
    '#10b981', // verde
    '#f59e0b', // naranja
    '#ef4444', // rojo
    '#8b5cf6', // morado
    '#ec4899', // rosa
    '#06b6d4', // cyan
  ];

  ngOnInit() {
    this.coleccionesFacade.cargarTodas();
  }

  getColorForId(id: number): string {
    return this.colores[id % this.colores.length];
  }

  getInitials(): string {
    const user = this.auth.usuarioActual();
    if (user && user.nombre) {
      const parts = user.nombre.split(' ');
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    return 'AR'; // Alex Rivera fallback
  }

  addCollection() {
    this.isCreatingCollection.set(true);
  }

  cancelNew() {
    this.isCreatingCollection.set(false);
  }

  async saveNew(name: string) {
    const trimmed = name.trim();
    if (trimmed) {
      await this.coleccionesFacade.crear(trimmed);
      this.isCreatingCollection.set(false);
    }
  }

  startEdit(id: number) {
    this.editingCollectionId = id;
  }

  cancelEdit() {
    this.editingCollectionId = null;
  }

  async saveEdit(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const newName = input.value.trim();
    
    if (newName) {
      await this.coleccionesFacade.actualizar(id, newName);
    }
    this.editingCollectionId = null;
  }

  async deleteCollection(id: number, name: string) {
    if (confirm(`Are you sure you want to delete the collection "${name}"?`)) {
      await this.coleccionesFacade.eliminar(id);
    }
  }
}
