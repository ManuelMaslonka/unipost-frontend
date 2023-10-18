import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FriendsService} from "./friends.service";
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {User} from "../shared/user.model";

@Component({
  selector: 'app-friend-bar',
  templateUrl: './friend-bar.component.html',
  styleUrls: ['./friend-bar.component.sass']
})
export class FriendBarComponent implements OnInit, OnDestroy {
  friends: User[] = []
  subscription: Subscription = new Subscription();

  friendsService: FriendsService = inject(FriendsService)
  authService: AuthService = inject(AuthService)

  ngOnInit() {
    this.friends = this.friendsService.getFriends();
    this.subscription = this.friendsService.friendsChanged.subscribe(
      (friends) => {
        this.friends = friends;
      }
    )
    this.authService.user.subscribe(
      user => {
        if (user) {
          this.friendsService.getFriendsByHttp(user.userId)
        }
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
