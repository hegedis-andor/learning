import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../../models/login.model';
import { RegistrationModel } from '../../models/registration.model';
import { User } from '../../models/user.model';
import { JwtService, JwtClaims } from './jwt.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const BASE_URL = '/api';
const REGISTRATION_URL = BASE_URL + '/authentication/registration';
const LOGIN_URL = BASE_URL + '/authentication/login';

@Injectable()
export class AuthService {
  private user: User;
  private authToken: string;

  constructor(private http: HttpClient, private jwtService: JwtService) {
    const authToken = this.jwtService.getTokenFromLocalStorage();

    if (authToken) {
      this.setUser(authToken);
    }
  }

  public register(registrationModel: RegistrationModel): Observable<string> {
    return this.http
      .post<{ status: string; auth_token: string }>(REGISTRATION_URL, registrationModel).pipe(
        map((response) => {
          this.jwtService.setTokenToLocalStorage(response.auth_token);
          this.setUser(response.auth_token);

          return response.status;
        })
      );
  }

  public login(loginModel: LoginModel): Observable<string> {
    return this.http
      .post<{ status: string; auth_token: string }>(LOGIN_URL, loginModel).pipe(
        map(response => {
          this.jwtService.setTokenToLocalStorage(response.auth_token);
          this.setUser(response.auth_token);

          return response.status;
      }));
  }

  public logOut(): void {
    this.jwtService.removeTokenFromLocalStorage();
    this.user = null;
    this.authToken = null;
  }

  public getUser(): User {
    return this.user;
  }

  public getAuthToken(): string {
    return this.authToken;
  }

  private setUser(token: string): void {
    this.authToken = token;
    const claims = this.jwtService.getClaims(token);
    this.user = {
      userName: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      roles: [ ...claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.split(',')],
      tokenExpireAt: claims.exp
    };
  }
}
