import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.interface';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-card" [class.out-of-stock]="!product.inStock">
      <div class="image-wrapper">
        <img [src]="product.image" [alt]="product.title">
        <div class="category-badge">{{ product.category }}</div>
        @if (!product.inStock) {
          <div class="sold-out-overlay">AGOTADO</div>
        }
      </div>
      
      <div class="meta-content">
        <h3 class="product-title">{{ product.title }}</h3>
        
        <div class="product-footer">
          <div class="price-box">
            <span class="label">PRECIO</span>
            @if (authService.currentRole() === 'EMPLEADO') {
              <div class="admin-price">
                <span class="currency">$</span>
                <input 
                  type="number" 
                  [(ngModel)]="product.price" 
                  (ngModelChange)="onPriceChange($event)"
                  class="price-input"
                >
              </div>
            } @else {
              <div class="price">{{ product.price | currency:'USD':'symbol':'1.0-2' }}</div>
            }
          </div>

          <div class="action-box">
            @if (authService.currentRole() === 'CLIENTE') {
              <button 
                class="btn-primary" 
                (click)="cartService.addToCart(product)"
                [disabled]="!product.inStock"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.4vh" height="1.4vh" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                AÑADIR
              </button>
            } @else if (authService.currentRole() === 'EMPLEADO') {
              <button 
                class="btn-action" 
                [class.btn-success]="!product.inStock"
                (click)="productService.toggleStock(product.id)"
              >
                {{ product.inStock ? 'AGOTAR' : 'RESTAURAR' }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: rgba(255, 255, 255, 0.02);
      border: 0.1vh solid rgba(255, 255, 255, 0.08);
      border-radius: 1vh;
      overflow: hidden;
      transition: all 0.3s var(--cubic);
      display: flex;
      flex-direction: column;
      height: 48vh;
      animation: fadeIn 0.4s var(--cubic) backwards;
    }

    .product-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-0.5vh);
    }

    .out-of-stock {
      opacity: 0.6;
    }

    .image-wrapper {
      position: relative;
      height: 28vh;
      background: rgba(255, 255, 255, 0.95);
      padding: 2vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .image-wrapper img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }

    .category-badge {
      position: absolute;
      bottom: 1.5vh;
      left: 1.5vh;
      background: rgba(0,0,0,0.85);
      color: rgba(255,255,255,0.7);
      font-size: 0.9vh;
      padding: 0.5vh 1vh;
      border-radius: 0.6vh;
      border: 0.1vh solid rgba(255,255,255,0.15);
      letter-spacing: 0.05vh;
    }

    .sold-out-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.8vh;
      font-weight: 900;
      letter-spacing: 0.3vh;
    }

    .meta-content {
      padding: 2vh;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .product-title {
      font-size: 1.5vh;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-weight: 500;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 1.5vh;
      border-top: 0.1vh solid rgba(255,255,255,0.06);
    }

    .price-box {
      display: flex;
      flex-direction: column;
      gap: 0.5vh;
    }

    .label {
      font-size: 0.9vh;
      color: rgba(255, 255, 255, 0.35);
      letter-spacing: 0.05vh;
    }

    .price {
      font-size: 2vh;
      font-weight: 800;
      color: white;
    }

    .admin-price {
      display: flex;
      align-items: center;
      gap: 0.5vh;
      background: rgba(0,0,0,0.3);
      border: 0.1vh solid rgba(255, 255, 255, 0.1);
      border-radius: 0.6vh;
      padding: 0.4vh 0.8vh;
    }

    .currency { font-size: 1.1vh; color: rgba(255, 255, 255, 0.5); }

    .price-input {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.5vh;
      width: 7vh;
      outline: none;
      padding: 0;
      font-weight: 700;
    }

    .btn-primary, .btn-action {
      background: rgba(255, 255, 255, 0.12);
      border: 0.1vh solid rgba(255, 255, 255, 0.2);
      border-radius: 0.6vh;
      color: white;
      padding: 1.2vh 1.8vh;
      font-size: 1.1vh;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.8vh;
      transition: all 0.2s ease;
      letter-spacing: 0.05vh;
    }

    .btn-primary:hover { background: rgba(255,255,255,0.2); transform: scale(1.02); }
    .btn-primary:disabled { opacity: 0.2; cursor: not-allowed; }

    .btn-success {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(0.5vh); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]

})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  public authService = inject(AuthService);
  public productService = inject(ProductService);
  public cartService = inject(CartService);

  onPriceChange(newPrice: number) {
    this.productService.updatePrice(this.product.id, newPrice);
  }
}
