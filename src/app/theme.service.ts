import { EventEmitter, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './shared/user.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly BASE_URL = 'http://localhost:8080/api/users';
  isDark = new BehaviorSubject(false);
  http = inject(HttpClient);

  toggleTheme() {
    this.isDark.next(!this.isDark.value);
    this.changeTheme();
  }

  changeTheme() {
    console.log('change theme');
    this.http.put(this.BASE_URL + '/darkmode', {}).subscribe((resData: any) => {
      let userData = localStorage.getItem('userData');
      let user: User;
      if (!userData) {
        return;
      } else {
        user = JSON.parse(userData);
        user.darkTheme = resData;
        localStorage.setItem('userData', JSON.stringify(user));
      }
    });
  }
}
