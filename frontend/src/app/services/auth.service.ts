import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SessionUser {
  id: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  //  In-memory cached auth state
  private userSubject = new BehaviorSubject<SessionUser | null>(null);

  // Observable for components/guards
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}


  login(data: any) {
    return this.http.post(
      `${environment.apiUrl}/auth/login`,
      data
    ).pipe(
      tap(() => {
        // After login, fetch session info from backend
        this.loadSession().subscribe();
      })
    );
  }

 
  register(data: any) {
    return this.http.post(
      `${environment.apiUrl}/auth/register`,
      data
    );
  }

  logout() {
    return this.http.post(
      `${environment.apiUrl}/auth/logout`,
      {}
    ).pipe(
      tap(() => {
        // Clear cached auth state
        this.userSubject.next(null);
      })
    );
  }


  loadSession() {
    return this.http.get<SessionUser>(
      `${environment.apiUrl}/auth/me`
    ).pipe(
      tap(user => {
        // Cache authenticated user in memory
        this.userSubject.next(user);
      })
    );
  }

  
  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  
  getRole(): string | null {
    return this.userSubject.value?.role || null;
  }
}
