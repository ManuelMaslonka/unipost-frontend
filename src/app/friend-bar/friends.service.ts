import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {BehaviorSubject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {User} from "../shared/user.model";

@Injectable({
  providedIn: 'root'
})
export class FriendsService implements OnInit, OnDestroy {

  private baseUrl: string = 'http://localhost:8080/api/';

  user!: User;
  friendsChanged: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  userSubs: Subscription = new Subscription();

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSubs = this.authService.user.subscribe(
      (user) => {
        console.log("Friends Service")
        if (user) {
          console.log(user)
          this.user = user
        }
      }
    )
  }


  getFriendsByHttp(userId: number) {
    this.http.get<User[]>(
      this.baseUrl + "users/friends/" + userId,
    ).subscribe(
      (friends: User[]) => {
        this.friendsChanged.next(friends);
      }
    )
  }


  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }


}
