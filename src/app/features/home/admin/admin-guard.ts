import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isAdmin().pipe(
    map((isAdmin: boolean): boolean => {
      if (isAdmin) {
        return true;
      } else if (authService.isAuthenticate) {
        router.navigate(['posts']).then((r) => console.log(r));
        return false;
      } else {
        router.navigate(['auth/login']).then((r) => console.log(r));
        return false;
      }
    }),
  );
};
