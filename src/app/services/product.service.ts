import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSignal = signal<Product[]>([]);
  public products = this.productsSignal.asReadonly();
  
  public inStockProducts = computed(() => 
    this.productsSignal().filter(p => p.inStock)
  );

  private readonly STORAGE_KEY = 'app_inventory_overrides';

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      // 1. Cargar productos desde la URL externa
      const rawProducts = await firstValueFrom(
        this.http.get<any[]>('https://fakestoreapi.com/products')
      );
      
      let products: Product[] = rawProducts.map(p => ({
        ...p,
        inStock: true // Valor por defecto
      }));

      // 2. Cargar "sobrescrituras" desde localStorage
      const savedOverrides = localStorage.getItem(this.STORAGE_KEY);
      
      if (savedOverrides) {
        const overrides = JSON.parse(savedOverrides);
        // Aplicar los cambios guardados sobre los productos de la URL
        products = products.map(p => {
          if (overrides[p.id]) {
            return { ...p, ...overrides[p.id] };
          }
          return p;
        });
      }
      
      this.productsSignal.set(products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  private saveOverride(productId: number, changes: Partial<Product>) {
    const savedOverrides = localStorage.getItem(this.STORAGE_KEY);
    const overrides = savedOverrides ? JSON.parse(savedOverrides) : {};
    
    overrides[productId] = { 
      ...(overrides[productId] || {}), 
      ...changes 
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(overrides));
  }

  toggleStock(productId: number) {
    this.productsSignal.update(products => 
      products.map(p => {
        if (p.id === productId) {
          const newStock = !p.inStock;
          this.saveOverride(productId, { inStock: newStock });
          return { ...p, inStock: newStock };
        }
        return p;
      })
    );
  }

  updatePrice(productId: number, newPrice: number) {
    this.productsSignal.update(products => 
      products.map(p => {
        if (p.id === productId) {
          this.saveOverride(productId, { price: newPrice });
          return { ...p, price: newPrice };
        }
        return p;
      })
    );
  }
}
