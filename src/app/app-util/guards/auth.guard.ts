import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Injectable} from "@angular/core";
import {AppUrls} from "../../app.urls";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.authService.Authenticated) {
      this.router.navigate([AppUrls.ROOT]).then(r => null);
      return false;
    }
    return true;
  }

}
