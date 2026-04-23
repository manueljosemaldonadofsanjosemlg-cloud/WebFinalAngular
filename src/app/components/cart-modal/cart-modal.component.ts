import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="cartService.showCart()" (click)="close()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="section-title">
            <span class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.8vh" height="1.8vh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </span>
            CARRITO DE COMPRA
          </h2>
          <button class="close-btn" (click)="close()">✕</button>
        </div>

        <div class="modal-content">
          <div class="items-list" *ngIf="!checkoutSuccess()">
            <div class="cart-item" *ngFor="let item of cartService.cartItems()">
              <img [src]="item.image" [alt]="item.title" class="item-img">
              <div class="item-info">
                <span class="item-name">{{ item.title }}</span>
                <span class="item-price">{{ item.price | currency }}</span>
              </div>
              <button class="remove-btn" (click)="cartService.removeFromCart(item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.4vh" height="1.4vh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>

            <div class="empty-state" *ngIf="cartService.cartCount() === 0">
              <span class="empty-text">EL CARRITO ESTÁ VACÍO</span>
            </div>
          </div>

          <!-- Success State -->
          <div class="success-state" *ngIf="checkoutSuccess()">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="8vh" height="8vh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>PAGO REALIZADO CON ÉXITO</h3>
            <p>TU PEDIDO HA SIDO PROCESADO CORRECTAMENTE</p>
            <button class="btn-primary" (click)="close()">VOLVER A LA TIENDA</button>
          </div>
        </div>

        <div class="modal-footer" *ngIf="cartService.cartCount() > 0 && !checkoutSuccess()">
          <div class="summary">
            <span class="label">TOTAL A PAGAR</span>
            <span class="total">{{ cartService.cartTotal() | currency }}</span>
          </div>
          
          <div class="payment-methods">
            <button class="paypal-btn" [class.loading]="isProcessing()" (click)="processPayment()">
              <span class="paypal-logo"><i>P</i>ay<i>P</i>al</span>
              {{ isProcessing() ? 'PROCESANDO...' : 'PAGAR AHORA' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(1vh);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .modal-card {
      width: 60vh;
      background: rgba(10, 10, 10, 0.95);
      border: 0.1vh solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5vh;
      outline: 0.1vh dashed rgba(255, 255, 255, 0.15);
      outline-offset: 0.3vh;
      padding: 3vh;
      display: flex;
      flex-direction: column;
      gap: 2vh;
      max-height: 80vh;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 0.1vh solid rgba(255, 255, 255, 0.05);
      padding-bottom: 2vh;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      font-size: 2.5vh;
      cursor: pointer;
      transition: color 0.2s;
    }

    .close-btn:hover { color: white; }

    .modal-content {
      flex: 1;
      overflow-y: auto;
      padding-right: 1.5vh;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1.5vh;
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 2vh;
      background: rgba(255, 255, 255, 0.03);
      padding: 1.5vh;
      border-radius: 1vh;
      border: 0.1vh solid rgba(255, 255, 255, 0.05);
    }

    .item-img {
      width: 6vh;
      height: 6vh;
      object-fit: contain;
      background: white;
      border-radius: 0.5vh;
    }

    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5vh;
    }

    .item-name {
      font-size: 1.4vh;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .item-price {
      font-size: 1.6vh;
      color: white;
      font-weight: 800;
    }

    .remove-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 0.1vh solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      width: 4vh;
      height: 4vh;
      border-radius: 0.8vh;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .modal-footer {
      border-top: 0.1vh solid rgba(255, 255, 255, 0.05);
      padding-top: 2.5vh;
      display: flex;
      flex-direction: column;
      gap: 3vh;
    }

    .summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary .label {
      font-size: 1.2vh;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.1vh;
    }

    .summary .total {
      font-size: 2.8vh;
      font-weight: 900;
      color: white;
    }

    .paypal-btn {
      width: 100%;
      height: 6vh;
      background: #0070ba;
      border: none;
      border-radius: 1vh;
      color: white;
      font-size: 1.8vh;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5vh;
      transition: all 0.2s ease;
    }

    .paypal-btn:hover {
      background: #005ea6;
      transform: translateY(-0.2vh);
    }

    .paypal-logo {
      font-style: italic;
      font-weight: 900;
    }

    .paypal-logo i {
      color: #ffc439;
    }

    .success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 2vh;
      padding: 5vh 0;
      animation: popIn 0.5s var(--cubic);
    }

    .success-icon {
      width: 12vh;
      height: 12vh;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 2vh;
      border: 0.2vh solid rgba(255, 255, 255, 0.2);
    }

    .success-state h3 { font-size: 2.5vh; font-weight: 900; }
    .success-state p { font-size: 1.4vh; color: rgba(255, 255, 255, 0.4); margin-bottom: 2vh; }

    .btn-primary {
      padding: 1.5vh 3vh;
      background: rgba(255, 255, 255, 0.1);
      border: 0.1vh solid rgba(255, 255, 255, 0.15);
      border-radius: 0.8vh;
      color: white;
      font-size: 1.4vh;
      font-weight: 600;
      cursor: pointer;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes popIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class CartModalComponent {
  public cartService = inject(CartService);
  
  isProcessing = signal(false);
  checkoutSuccess = signal(false);

  close() {
    this.cartService.showCart.set(false);
    this.checkoutSuccess.set(false);
  }

  processPayment() {
    if (this.cartService.cartCount() === 0) return;
    
    this.isProcessing.set(true);
    
    // Simulación de pago
    setTimeout(() => {
      this.isProcessing.set(false);
      this.checkoutSuccess.set(true);
      this.cartService.clearCart();
    }, 2000);
  }
}
