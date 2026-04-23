import { Injectable, signal } from '@angular/core';

export type UserRole = 'CLIENTE' | 'EMPLEADO' | 'NONE';

export interface User {
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { username: 'admin', password: 'admin123', role: 'EMPLEADO', fullName: 'Administrador Senior' },
    { username: 'boss', password: 'pass123', role: 'EMPLEADO', fullName: 'Gerente Tienda' },
    { username: 'manuel', password: 'client123', role: 'CLIENTE', fullName: 'Manuel Guerrero' },
    { username: 'user', password: 'user123', role: 'CLIENTE', fullName: 'Usuario Demo' }
  ];

  private readonly STORAGE_KEY = 'app_session_data';

  private currentRoleSignal = signal<UserRole>(this.getInitialRole());
  private currentUserSignal = signal<User | null>(this.getInitialUser());
  
  public currentRole = this.currentRoleSignal.asReadonly();
  public currentUser = this.currentUserSignal.asReadonly();

  constructor() {}

  private getInitialRole(): UserRole {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved).role : 'NONE';
    } catch (e) {
      return 'NONE';
    }
  }

  private getInitialUser(): User | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUserSignal.set(user);
      this.currentRoleSignal.set(user.role);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout() {
    this.currentUserSignal.set(null);
    this.currentRoleSignal.set('NONE');
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
