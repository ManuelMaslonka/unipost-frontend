import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../shared/user.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private BASE_URL = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  search(search: string) {
    return this.http.post<User[]>(this.BASE_URL + 'users/search', {
      username: search,
    });
  }
}
