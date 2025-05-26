import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AppUrls} from "../../app.urls";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserProfileGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const profileUuid = route.params['uuid'];
    if (this.authService.IsAdmin
      || profileUuid ===
      this.authService.UserDetails?.uuid) {
      return true;
    } else {
      this.router.navigate([AppUrls.USER.USER_PROFILE(profileUuid)]).then(r => null);
      return false
    }
  }

}
