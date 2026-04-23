import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NavbarComponent, ProductCardComponent],
  template: `
    <app-navbar />
    <main class="store-container">
      <header class="list-header">
        <h1>
          @if (authService.currentRole() === 'CLIENTE') {
            Catálogo de Productos
          } @else {
            Panel de Administración
          }
        </h1>
        <p class="subtitle">
          @if (authService.currentRole() === 'CLIENTE') {
            Explora las mejores ofertas en tecnología
          } @else {
            Gestión de stock y precios en tiempo real
          }
        </p>
      </header>

      <div class="product-grid">
        @for (product of displayProducts(); track product.id) {
          <app-product-card [product]="product" />
        }
      </div>
    </main>
  `,
  styles: [`
    .store-container {
      padding: 1vh 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .list-header {
      margin-bottom: 3vh;
      border-left: 0.4vh solid rgba(255, 255, 255, 0.2);
      padding-left: 2vh;
    }
    h1 {
      font-size: 2.8vh;
      font-family: var(--font-title) !important;
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 1vh;
      letter-spacing: 0.1vh;
    }
    .subtitle {
      color: rgba(255, 255, 255, 0.4);
      font-size: 1.4vh;
      letter-spacing: 0.08vh;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(32vh, 1fr));
      gap: 2.5vh;
      flex: 1;
      padding-bottom: 3vh;
    }

    /* Scrollbar for grid */
    .product-grid::-webkit-scrollbar {
      width: 0.3vh;
    }
    .product-grid::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1vh;
    }
  `]
})
export class ProductListComponent {
  public productService = inject(ProductService);
  public authService = inject(AuthService);

  displayProducts() {
    return this.productService.products();
  }
}
