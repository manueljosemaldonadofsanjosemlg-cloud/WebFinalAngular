import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="toolbar">
      <div class="user-chip">
        <div class="icon-box-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2vh" height="1.2vh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div class="info">
          <span class="label">SESIÓN ACTIVA</span>
          <span class="value">{{ authService.currentUser()?.fullName }}</span>
        </div>
      </div>
      
      <div class="tools">
        @if (authService.currentRole() === 'CLIENTE') {
          <div class="stat-pill clickable" (click)="cartService.showCart.set(true)">
            <span class="label">CARRITO</span>
            <span class="value">{{ cartService.cartCount() }} ITEMS</span>
            <span class="divider"></span>
            <span class="value accent">{{ cartService.cartTotal() | currency:'USD':'symbol':'1.0-0' }}</span>
          </div>
        } @else {
          <div class="stat-pill admin">
            <span class="label">MÓDULO</span>
            <span class="value">ADMINISTRACIÓN</span>
          </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.02);
      border: 0.1vh solid rgba(255, 255, 255, 0.08);
      border-radius: 0.8vh;
      padding: 1.5vh 2.5vh;
      margin-top: 1.5vh;
      margin-bottom: 3vh;
    }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 1.5vh;
    }

    .icon-box-sm {
      width: 4vh;
      height: 4vh;
      background: rgba(255, 255, 255, 0.06);
      border: 0.1vh solid rgba(255, 255, 255, 0.12);
      border-radius: 0.6vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .icon-box-sm svg {
      width: 2vh;
      height: 2vh;
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 0.3vh;
    }

    .label {
      font-size: 1vh;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.08vh;
    }

    .value {
      font-size: 1.4vh;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 600;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 1.5vh;
      background: rgba(255, 255, 255, 0.04);
      padding: 1vh 2vh;
      border-radius: 0.8vh;
      border: 0.1vh solid rgba(255, 255, 255, 0.1);
    }

    .divider {
      width: 0.1vh;
      height: 1.8vh;
      background: rgba(255, 255, 255, 0.15);
    }

    .value.accent {
      color: white;
      font-weight: 800;
    }

    .clickable {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clickable:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-0.2vh);
    }

    .admin .value {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.4vh;
    }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);
  public cartService = inject(CartService);
}
