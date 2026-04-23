import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2 class="login-title">IDENTIFICACIÓN REQUERIDA</h2>
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="input-group">
            <span class="input-label">USUARIO</span>
            <div class="input-field-container">
              <span class="field-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.4vh" height="1.4vh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <input 
                type="text" 
                [(ngModel)]="username" 
                name="username" 
                placeholder="Ingresar usuario"
                class="login-input"
                (keydown)="checkCapsLock($event)"
                required
              >
            </div>
          </div>
          
          <div class="input-group">
            <span class="input-label">CONTRASEÑA</span>
            <div class="input-field-container">
              <span class="field-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.4vh" height="1.4vh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                placeholder="••••••••"
                class="login-input"
                (keydown)="checkCapsLock($event)"
                required
              >
            </div>
          </div>

          @if (capsLockOn()) {
            <div class="caps-warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2vh" height="1.2vh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              BLOQ MAYÚS ACTIVADO
            </div>
          }

          @if (error()) {
            <p class="error-text">{{ error() }}</p>
          }
          
          <button type="submit" class="auth-submit-btn">
            ACCEDER AL SISTEMA
          </button>
        </form>

        <div class="test-creds-panel">
          <span class="panel-header-text">ACCESOS DE PRUEBA:</span>
          <div class="panel-list">
            <div class="panel-row">
              <span class="row-role">EMPLEADO:</span>
              <span class="row-val">admin / admin123</span>
            </div>
            <div class="panel-row">
              <span class="row-role">CLIENTE:</span>
              <span class="row-val">manuel / client123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2vh;
      background: transparent;
    }

    .login-card {
      width: 60vh;
      display: flex;
      flex-direction: column;
      gap: 4vh;
    }

    .login-title {
      font-size: 1.8vh;
      color: rgba(255, 255, 255, 0.5);
      border-left: 0.3vh solid rgba(255, 255, 255, 0.3);
      padding-left: 1.5vh;
      letter-spacing: 0.15vh;
      font-family: 'Evogria', sans-serif !important;
      text-transform: uppercase;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 2.5vh;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 1.2vh;
    }

    .input-label {
      font-size: 1.3vh;
      color: rgba(255, 255, 255, 0.4);
      margin-left: 0.8vh;
      text-transform: uppercase;
    }

    .input-field-container {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      border: 0.1vh solid rgba(255, 255, 255, 0.1);
      border-radius: 0.8vh;
      padding: 0 2vh;
      height: 6vh;
    }

    .field-icon {
      color: rgba(255, 255, 255, 0.3);
      margin-right: 1.5vh;
      display: flex;
    }

    .login-input {
      background: transparent !important;
      border: none !important;
      color: white !important;
      font-size: 1.8vh !important;
      width: 100%;
      outline: none !important;
      /* ESTO ES LO MÁS IMPORTANTE: */
      font-family: Arial, sans-serif !important;
      text-transform: none !important;
    }

    .login-input::placeholder {
      color: rgba(255, 255, 255, 0.15);
      text-transform: none;
    }

    .auth-submit-btn {
      height: 6vh;
      background: rgba(255, 255, 255, 0.15);
      border: 0.1vh solid rgba(255, 255, 255, 0.2);
      border-radius: 0.8vh;
      color: white;
      font-size: 1.4vh;
      font-weight: 600;
      cursor: pointer;
      text-transform: uppercase;
      font-family: 'Roboto Condensed', sans-serif !important;
    }

    .error-text {
      color: #ff4d4d;
      font-size: 1.2vh;
      text-align: center;
    }

    .caps-warning {
      background: rgba(255, 255, 255, 0.05);
      border: 0.1vh solid rgba(255, 255, 255, 0.15);
      color: white;
      padding: 1vh;
      font-size: 1.1vh;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1vh;
      border-radius: 0.6vh;
      animation: fadeIn 0.3s ease;
      font-family: inherit !important;
    }

    .test-creds-panel {
      background: rgba(255, 255, 255, 0.02);
      border: 0.1vh dashed rgba(255, 255, 255, 0.08);
      border-radius: 1vh;
      padding: 2.5vh;
    }

    .panel-header-text {
      font-size: 1.4vh;
      color: rgba(255, 255, 255, 0.3);
      text-transform: uppercase;
      display: block;
      margin-bottom: 2vh;
    }

    .panel-list {
      display: flex;
      flex-direction: column;
      gap: 1vh;
    }

    .panel-row {
      display: flex;
      justify-content: space-between;
      font-size: 1.6vh;
    }

    .row-role { color: rgba(255, 255, 255, 0.5); text-transform: uppercase; }
    .row-val { color: rgba(255, 255, 255, 0.8); }
  `]
})
export class SelectionComponent {
  private authService = inject(AuthService);
  
  username = '';
  password = '';
  error = signal('');

    onLogin() {
      this.error.set('');
      const success = this.authService.login(this.username, this.password);
      if (!success) {
        this.error.set('Credenciales incorrectas.');
      }
    }

    capsLockOn = signal(false);

    checkCapsLock(event: KeyboardEvent) {
      this.capsLockOn.set(event.getModifierState('CapsLock'));
    }
}
