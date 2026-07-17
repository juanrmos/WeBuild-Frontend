import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@modules/auth/application/auth.facade';
import { AuthService } from '@core/services/auth.service';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { RegisterFormComponent } from '../components/register-form/register-form.component';

@Component({
  selector: 'wb-login-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent, RegisterFormComponent],
  template: `
    <div class="login-wrapper">
      <div class="auth-box">
        <div class="auth-header">
          <div class="logo-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 6h4"/>
              <path d="M2 10h4"/>
              <path d="M2 14h4"/>
              <path d="M2 18h4"/>
              <rect width="16" height="20" x="4" y="2" rx="2"/>
              <path d="M16 2v20"/>
            </svg>
          </div>
          <h1>Welcome back to Slate</h1>
          <p>Sign in to your notes, collections, and document library.</p>
        </div>

        @if (!mostrandoRegistro()) {
          <wb-login-form 
            [cargando]="facade.cargando()" 
            [error]="facade.error()" 
            (loginSubmit)="onLogin($event)" 
          />
        } @else {
          <wb-register-form 
            [cargando]="facade.cargando()" 
            [error]="facade.error()" 
            (registerSubmit)="onRegister($event)" 
          />
        }

        <div class="toggle-view">
          {{ mostrandoRegistro() ? 'Already have an account?' : "Don't have an account?" }}
          <button class="btn-link" (click)="toggleView()">
            {{ mostrandoRegistro() ? 'Sign in' : 'Create one' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #000000;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .auth-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;
      max-width: 400px;
    }
    .auth-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      h1 {
        margin: 1.5rem 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 700;
      }
      p {
        margin: 0;
        color: #888888;
        font-size: 0.95rem;
      }
    }
    .logo-circle {
      width: 48px;
      height: 48px;
      background: #eeeeee;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
    }
    .toggle-view {
      color: #888888;
      font-size: 0.9rem;
      margin-top: 1rem;
    }
    .btn-link {
      background: none;
      border: none;
      color: #ffffff;
      cursor: pointer;
      font-weight: 600;
      padding: 0 0 0 0.25rem;
      font-size: 0.9rem;
      
      &:hover { text-decoration: underline; }
    }
  `]
})
export class LoginContainer {
  protected readonly facade = inject(AuthFacade);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly mostrandoRegistro = signal(false);

  toggleView(): void {
    this.facade.error.set(null);
    this.mostrandoRegistro.set(!this.mostrandoRegistro());
  }

  async onLogin(credentials: any): Promise<void> {
    const result = await this.facade.login(credentials.email, credentials.password);
    if (result) {
      this.authService.setSession(result.token, result.usuario);
      this.router.navigate(['/notas']);
    }
  }

  async onRegister(data: any): Promise<void> {
    const success = await this.facade.register(data.nombre, data.email, data.password);
    if (success) {
      // Auto-login o enviar a login
      this.toggleView();
      // Opcional: mostrar un mensaje de éxito
      alert('Registro exitoso. Ahora inicia sesión.');
    }
  }
}
