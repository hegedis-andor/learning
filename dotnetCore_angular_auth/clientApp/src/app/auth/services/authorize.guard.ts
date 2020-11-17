import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const tokenExpired = user.tokenExpireAt <= (Date.now() / 1000);
    if (tokenExpired) {
      this.authService.logOut();
      this.router.navigate(['/login']);
      return false;
    }

    const userRoles = user.roles;
    const requiredRoleToActivate: string[] | null = route.data.canSee;
    const isRoleNeededForRoute = requiredRoleToActivate !== undefined;
    const userHasRight = isRoleNeededForRoute ? userRoles.map(role => requiredRoleToActivate.includes(role)).includes(true) : true;
    if (!userHasRight) {
      return false;
    }

    return true;
  }
}
