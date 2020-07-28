import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  ACCESS_TOKEN_KEY = 'auth-token';

  getToken(): string {
		return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  
  setToken(token) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  clearToken() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
}
