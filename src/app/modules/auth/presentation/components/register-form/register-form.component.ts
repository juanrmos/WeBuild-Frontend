import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'wb-register-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="glass-panel form-panel">
      @if (error()) {
        <div class="error-banner">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-group">
          <label>Name</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <input 
              type="text" 
              formControlName="nombre" 
              class="wb-input-dark" 
              placeholder="Your full name"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Email</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <input 
              type="email" 
              formControlName="email" 
              class="wb-input-dark" 
              placeholder="alex@slate.app"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input 
              type="password" 
              formControlName="password" 
              class="wb-input-dark" 
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" class="wb-btn-light btn-submit" [disabled]="form.invalid || cargando()">
          {{ cargando() ? 'Signing up...' : 'Sign up' }} 
          @if (!cargando()) {
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          }
        </button>
      </form>
    </div>
  `,
  styles: [`
    .form-panel {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      border-radius: 16px;
      background: #181818;
      border: 1px solid #2a2a2a;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        font-size: 0.9rem;
        font-weight: 500;
        color: #ffffff;
      }
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      width: 18px;
      height: 18px;
      color: #888888;
    }
    .wb-input-dark {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border-radius: 8px;
      border: 1px solid #2a2a2a;
      background: #0a0a0a;
      color: #ffffff;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
      box-sizing: border-box;

      &:focus {
        border-color: #555;
      }
      &::placeholder {
        color: #555555;
      }
    }
    .btn-submit {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.8rem;
      font-size: 1rem;
      font-weight: 600;
      color: #000000;
      background: #eeeeee;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: background 0.2s;
      
      &:hover:not(:disabled) { 
        background: #ffffff; 
      }
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    .arrow-icon {
      width: 18px;
      height: 18px;
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      padding: 0.8rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
    }
  `]
})
export class RegisterFormComponent {
  readonly cargando = input<boolean>(false);
  readonly error = input<string | null>(null);
  
  readonly registerSubmit = output<{ nombre: string; email: string; password: string }>();

  protected readonly form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.cargando()) {
      this.registerSubmit.emit(this.form.value);
    }
  }
}
