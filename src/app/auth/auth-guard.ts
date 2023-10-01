import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const authService: AuthService = inject(AuthService)
  const router: Router = inject(Router);


  return authService.isAuthenticated()
    .then((authentication: boolean | unknown): boolean => {
        if (authentication) {
          return true
        } else {
          router.navigate(['auth/login']).then(r => console.log(r));
          return false
        }
      }
    )
}
