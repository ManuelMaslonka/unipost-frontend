import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../../shared/user.model';
import { Router } from '@angular/router';
import { Followers } from '../../shared/followers.model';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
  expiration_time: string;
  expiration_refresh_time: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl: string = 'http://localhost:8080/api/';

  isAuthenticate: boolean = false;
  access_token: string = '';
  refresh_token: string = '';
  tokenExpirationTime: any;
  tokenExpirationTimer: any;
  refreshTokenExpirationTimer: any;
  user = new BehaviorSubject<User | null>(null);
  userVariable: User | null = null;
  isRoleAdmin: boolean = false;
  imageSrc!: SafeUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  isAuthenticated(): Observable<boolean> {
    return of(this.isAuthenticate);
  }

  isAdmin() {
    return of(this.isRoleAdmin);
  }

  logIn(email: string, password: string) {
    return this.http
      .post<AuthenticationResponse>(this.baseUrl + 'auth/authenticate', {
        email: email,
        password: password,
      })
      .pipe(
        catchError((err) => {
          return throwError(() => err.error.message);
        }),
        tap((resData) => {
          console.log(resData);
          this.handleAuthentication(resData);
        }),
      );
  }

  handleAuthentication(data: AuthenticationResponse) {
    this.access_token = data.access_token;
    this.refresh_token = data.refresh_token;
    this.tokenExpirationTime = data.expiration_time;
    this.refreshTokenExpirationTimer = data.expiration_refresh_time;
    this.autoLogoOut(
      new Date(data.expiration_time).getTime() - new Date().getTime(),
    );
    this.saveTokenToUser(data.user);
    this.setTrueAuthenticate();
    this.isRoleAdmin = data.user.role === 'ADMIN';
    this.router.navigate(['/posts']);
  }

  autoLogin() {
    let userData = localStorage.getItem('userData');
    let user: User;
    if (!userData) {
      return;
    } else {
      user = JSON.parse(userData);
    }
    if (user._token != null) {
      const loadedUser = new User(
        user.userId,
        user.nickName,
        user.firstName,
        user.lastName,
        user.email,
        user.createdDated,
        user.country,
        user.gender,
        user.faculty,
        user.posts,
        user.like,
        user.imageUrl,
        user.comments,
        user.followers,
        user.darkTheme,
        user.role,
        user._token,
        user._refreshToken,
        user._tokenExpirationTime,
        user._refreshTokenExpirationTime,
      );
      if (loadedUser._tokenExpirationTime) {
        this.user.next(loadedUser);
        this.isAuthenticate = true;
        this.isRoleAdmin = loadedUser.role === 'ADMIN';
        this.autoLogoOut(
          new Date(loadedUser._tokenExpirationTime).getTime() -
            new Date().getTime(),
        );
      }
    }
  }

  saveTokenToUser(data: User) {
    data._token = this.access_token;
    data._refreshToken = this.refresh_token;
    data._tokenExpirationTime = this.tokenExpirationTime;
    data._refreshTokenExpirationTime = this.refreshTokenExpirationTimer;
    this.setToLocalStorageUser(data);
    this.user.next(data);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime);
    }
    this.isAuthenticate = false;
    this.tokenExpirationTime = null;
  }

  autoLogoOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration * 1000);
  }

  setAccessToken(access_token: string) {
    this.access_token = access_token;
  }

  setRefreshToken(refresh_token: string) {
    this.refresh_token = refresh_token;
  }

  setTrueAuthenticate() {
    this.isAuthenticate = true;
  }

  setToLocalStorageUser(user: User) {
    console.log(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  getFollowingByHttp(userId: number) {
    return this.http.get<Followers[]>(this.baseUrl + 'followers/' + userId);
  }

  register(registerForm: FormGroup, profImage: File | null) {
    let formData = new FormData();
    formData.append('nickName', registerForm.get('nickName')?.value);
    formData.append('firstName', registerForm.get('firstName')?.value);
    formData.append('lastName', registerForm.get('lastName')?.value);
    formData.append('password', registerForm.get('password')?.value);
    formData.append('email', registerForm.get('email')?.value);
    formData.append('country', registerForm.get('country')?.value);
    formData.append('faculty', registerForm.get('faculty')?.value);
    formData.append('gender', registerForm.get('gender')?.value);

    if (profImage != null) formData.append('profImage', profImage);

    return this.http.post(this.baseUrl + 'auth/register', formData).pipe(
      catchError((err) => {
        return throwError(() => {
          return err.error.message;
        });
      }),
    );
  }

  getProfileImageLoggedUser() {
    let images: SafeUrl[] = [];
    this.http
      .get<Blob>(this.baseUrl + 'images/profile', {
        responseType: 'blob' as 'json',
      })
      .subscribe((blob) => {
        let objectURL = URL.createObjectURL(blob);
        this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        images.push(this.imageSrc);
      });
    return images;
  }

  getProfileImageUser(userId: number) {
    let images: SafeUrl[] = [];
    this.http
      .get<Blob>(this.baseUrl + 'images/postsAuthor/' + userId, {
        responseType: 'blob' as 'json',
      })
      .subscribe((blob) => {
        let objectURL = URL.createObjectURL(blob);
        this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        images.push(this.imageSrc);
      });
    return images;
  }

  deleteAccount() {
    this.http.delete(this.baseUrl + 'users/account').subscribe(() => {
      this.logout();
    });
  }

  getProfileImagesUser(searchedUsers: User[]) {
    let images: SafeUrl[] = [];
    searchedUsers.forEach((user) => {
      this.http
        .get<Blob>(this.baseUrl + 'images/postsAuthor/' + user.userId, {
          responseType: 'blob' as 'json',
        })
        .subscribe((blob) => {
          let objectURL = URL.createObjectURL(blob);
          this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          images.push(this.imageSrc);
        });
    });
    return images;
  }
}
