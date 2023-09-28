import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class AuthService {
  Authenticate: boolean = false;

  isAuthenticated() {
    return new Promise(
      (resolve, reject) => {
        setInterval(() => {
          resolve(this.Authenticate)
        }, 800)
      }
    )
  }

  login() {
    this.Authenticate = true;
  }

  logout() {
    this.Authenticate = false;
  }
}
