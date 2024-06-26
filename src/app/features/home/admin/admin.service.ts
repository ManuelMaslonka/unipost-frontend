import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../shared/user.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Post } from '../posts/post/post.model';

@Injectable({ providedIn: 'root' })
export class AdminService implements OnDestroy {
  http = inject(HttpClient);
  BASE_URL: string = 'http://localhost:8080/api/';
  users$ = new BehaviorSubject<User[]>([]);
  posts$ = new BehaviorSubject<Post[]>([]);
  private httpSub!: Subscription;
  private httpSub1!: Subscription;
  private httpSubDel!: Subscription;
  private httpSubDel1!: Subscription;

  ngOnInit(): void {}

  banUserforDay(userId: number) {
    this.http
      .put<boolean>(this.BASE_URL + 'admins/ban-day/' + userId, {})
      .subscribe(() => {
        this.getUsersFromBackend();
      });
  }

  banUserforWeek(userId: number) {
    this.http
      .put<boolean>(this.BASE_URL + 'admins/ban-week/' + userId, {})
      .subscribe(() => {
        this.getUsersFromBackend();
      });
  }

  banUserPertamently(userId: number) {
    this.http
      .put<boolean>(this.BASE_URL + 'admins/ban-permanent/' + userId, {})
      .subscribe(() => {
        this.getUsersFromBackend();
      });
  }

  getUsersFromBackend() {
    this.httpSub = this.http
      .get<User[]>(this.BASE_URL + 'admins/users')
      .subscribe((users) => {
        console.log(users);
        this.users$.next(users);
      });
  }

  getPostsFromBackend() {
    this.httpSub1 = this.http
      .get<Post[]>(this.BASE_URL + 'admins/posts')
      .subscribe((users) => {
        this.posts$.next(users);
      });
  }

  deletePostById(postId: number) {
    this.httpSubDel = this.http
      .delete<Post>(this.BASE_URL + 'admins/posts/' + postId)
      .subscribe(() => {
        this.getPostsFromBackend();
      });
  }

  getUsers() {
    return this.users$.asObservable();
  }

  deleteUserById(userId: number) {
    this.httpSubDel1 = this.http
      .delete<User>(this.BASE_URL + 'admins/users/' + userId)
      .subscribe(() => {
        this.getUsersFromBackend();
      });
  }

  ngOnDestroy(): void {
    this.httpSub.unsubscribe();
    this.httpSub1.unsubscribe();
    this.httpSubDel.unsubscribe();
    this.httpSubDel1.unsubscribe();
  }

  updateUser(id: any, value: FormGroup) {
    this.http
      .post<boolean>(this.BASE_URL + 'admins/edit/' + id, value.value)
      .subscribe(() => {
        this.getUsersFromBackend();
      });
  }

  promoteUser(userId: number) {
    this.http
      .post<boolean>(this.BASE_URL + 'admins/promote/' + userId, {})
      .subscribe(() => {
        this.getUsersFromBackend();
      });
  }
}
