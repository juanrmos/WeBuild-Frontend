import { Component, ChangeDetectionStrategy, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Coleccion } from '../../../domain/models/coleccion.model';

@Component({
  selector: 'wb-coleccion-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="coleccion-form-container glass-panel">
      <h3>{{ coleccionEditar() ? 'Editar Colección' : 'Nueva Colección' }}</h3>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-row">
        <input 
          type="text" 
          formControlName="nombre" 
          class="wb-input" 
          placeholder="Nombre de la colección..." 
        />
        <button type="submit" class="wb-btn" [disabled]="form.invalid || cargando()">
          {{ coleccionEditar() ? 'Actualizar' : 'Crear' }}
        </button>
        @if (coleccionEditar()) {
          <button type="button" class="wb-btn btn-cancel" (click)="onCancelar()">Cancelar</button>
        }
      </form>
    </div>
  `,
  styles: [`
    .coleccion-form-container {
      padding: 1.5rem;
      margin-bottom: 2rem;
      
      h3 {
        margin: 0 0 1rem 0;
      }
    }
    .form-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      
      .wb-input {
        flex: 1;
      }
    }
    .btn-cancel {
      background: rgba(255, 255, 255, 0.1);
      &:hover { background: rgba(255, 255, 255, 0.2); }
    }
  `]
})
export class ColeccionFormComponent {
  readonly cargando = input<boolean>(false);
  readonly coleccionEditar = input<Coleccion | null>(null);
  
  readonly guardado = output<{ id?: number; nombre: string }>();
  readonly cancelado = output<void>();

  protected readonly form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]]
    });

    effect(() => {
      const editar = this.coleccionEditar();
      if (editar) {
        this.form.patchValue({ nombre: editar.nombre });
      } else {
        this.form.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.cargando()) {
      const editar = this.coleccionEditar();
      this.guardado.emit({
        id: editar?.id,
        nombre: this.form.value.nombre as string
      });
      if (!editar) {
        this.form.reset();
      }
    }
  }

  onCancelar(): void {
    this.form.reset();
    this.cancelado.emit();
  }
}
