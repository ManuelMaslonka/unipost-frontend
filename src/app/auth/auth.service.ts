import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {of, Subject} from "rxjs";
import {User} from "../shared/user.model";

interface AuthenticationResponse {
    access_token: string,
    refresh_token: string
}

@Injectable({providedIn: "root"})
export class AuthService {

    private baseUrl: string = 'http://localhost:8080/';

    Authenticate: boolean = false;
    access_token: string = '';
    refresh_token: string = '';
    user = new Subject<User>();

    constructor(private http: HttpClient) {
    }

    isAuthenticated() {
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }

    logIn(email: string, password: string) {
        return this.http.post<AuthenticationResponse>(
            this.baseUrl + 'auth/authenticate',
            {
                email: email,
                password: password
            }
        )
    }

    getUserByToken() {
        return this.http.post<User>(
            this.baseUrl + "users/token", {
                token: this.access_token
            }
        )
    }

    logout() {

    }

    setAccessToken(access_token: string) {
        this.access_token = access_token
    }

    setRefreshToken(refresh_token: string) {
        this.refresh_token = refresh_token;
    }

    setUser() {
        this.getUserByToken().subscribe(user => {
            console.log(user);
            this.user.next(user);
        })
    }
}
