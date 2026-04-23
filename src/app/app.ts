import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { SelectionComponent } from './components/selection/selection.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { RouterOutlet } from '@angular/router';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SelectionComponent, ProductListComponent, RouterOutlet, CartModalComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  public authService = inject(AuthService);
  public cartService = inject(CartService);
}
