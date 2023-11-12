import {inject, Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../shared/user.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormGroup} from "@angular/forms";

@Injectable({providedIn: "root"})
export class AdminService implements OnDestroy {

  http = inject(HttpClient);
  BASE_URL: string = 'http://localhost:8080/api/';
  users$ = new BehaviorSubject<User[]>([]);
  httpSub: Subscription = new Subscription();

  ngOnInit(): void {

  }

  getUsersFromBackend() {
    this.httpSub = this.http.get<User[]>(
      this.BASE_URL + 'admins/users'
    ).subscribe(
      users => {
        console.log(users);
        this.users$.next(users);
      }
    )
  }

  getUsers() {
    return this.users$.asObservable();
  }

  deleteUserById(userId: number) {
    this.http.delete<User>(
      this.BASE_URL + 'admins/users/' + userId
    ).subscribe(
      () => {
        this.getUsersFromBackend();
      }
    )
  }

  ngOnDestroy(): void {
    this.httpSub.unsubscribe();
  }


  updateUser(id: any, value: FormGroup) {

    this.http.post<boolean>(
      this.BASE_URL + 'admins/edit/' + id,
      value.value
    ).subscribe(
      () => {
        this.getUsersFromBackend();
      }
    )

  }

  promoteUser(userId: number) {
    this.http.post<boolean>(
      this.BASE_URL + 'admins/promote/' + userId,
      {}
    ).subscribe(
      () => {
        this.getUsersFromBackend();
      }
    )
  }
}
