import {
  Component,
  inject,
  OnDestroy,
  OnInit
}                       from '@angular/core';
import {Friend}         from "./friend.model";
import {FriendsService} from "./friends.service";
import {Subscription}   from "rxjs";

@Component({
  selector: 'app-friend-bar',
  templateUrl: './friend-bar.component.html',
  styleUrls: ['./friend-bar.component.sass']
})
export class FriendBarComponent implements OnInit, OnDestroy {
  friends: Friend[] = []
  subscription: Subscription = new Subscription();

  friendsService: FriendsService = inject(FriendsService)

  ngOnInit() {
    this.friends = this.friendsService.getFriends();
    this.subscription = this.friendsService.friendsChanged.subscribe(
      (friends) => {
        this.friends = friends;
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
