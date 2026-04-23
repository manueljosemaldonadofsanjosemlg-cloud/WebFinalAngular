import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSignal = signal<Product[]>([]);
  public cartItems = this.cartItemsSignal.asReadonly();
  public cartCount = computed(() => this.cartItemsSignal().length);
  public cartTotal = computed(() => 
    this.cartItemsSignal().reduce((total, item) => total + item.price, 0)
  );

  public showCart = signal(false);

  private readonly STORAGE_KEY = 'origen_cart_data';

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.cartItemsSignal.set(JSON.parse(saved));
    }
  }

  private saveCart() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItemsSignal()));
  }

  addToCart(product: Product) {
    this.cartItemsSignal.update(items => [...items, product]);
    this.saveCart();
  }

  removeFromCart(productId: number) {
    this.cartItemsSignal.update(items => {
      const index = items.findIndex(item => item.id === productId);
      if (index > -1) {
        const newItems = [...items];
        newItems.splice(index, 1);
        return newItems;
      }
      return items;
    });
    this.saveCart();
  }

  clearCart() {
    this.cartItemsSignal.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
