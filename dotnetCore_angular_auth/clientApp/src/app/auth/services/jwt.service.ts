import { Injectable } from '@angular/core';

export interface JwtClaims {
  aud: string;
  exp: number;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string; // ex: "User" or "User, Admin"...
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  iss: string;
  nbf: string;
}

const localStorageAuthTokenKey = 'auth_token';

@Injectable()
export class JwtService {

  public setTokenToLocalStorage(token: string): void {
    localStorage.setItem(localStorageAuthTokenKey, token);
  }

  public getTokenFromLocalStorage(): string {
    const token =  localStorage.getItem(localStorageAuthTokenKey);

    if (!!token && !this.isAuthTokenExpired(token)) {
      return token;
    }

    return null;
  }

  public removeTokenFromLocalStorage(): void {
    localStorage.removeItem(localStorageAuthTokenKey);
  }

  public isAuthTokenExpired(token: string): boolean {
    const claims = this.getClaims(token);
    return claims.exp < (Date.now() / 1000);
  }

  public getClaims(token: string): JwtClaims {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
