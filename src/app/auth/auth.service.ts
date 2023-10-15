import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";

interface AuthenticationResponse {
  access_token: string,
  refresh_token: string
}

@Injectable({providedIn: "root"})
export class AuthService {

  private baseUrl: string = 'http://localhost:8080';

  Authenticate: boolean = false;
  access_token: string = '';
  refresh_token: string = '';

  constructor(private http: HttpClient) {
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }

  logIn(email: string, password: string) {
    this.http.post<AuthenticationResponse>(
      this.baseUrl + '/auth/authenticate',
      {
        email: email,
        password: password
      }).subscribe(
        resData => {
          this.access_token = resData.access_token;
          this.refresh_token = resData.refresh_token;
          console.log(this.access_token)
          this.getUserByToken();
        }
    )
  }

  getUserByToken() {
    this.http.post(
      this.baseUrl + "/users/token", {
        token: this.access_token
      }
    ).subscribe(resData => {
      console.log(resData);
    })
  }

  logout() {

  }
}
