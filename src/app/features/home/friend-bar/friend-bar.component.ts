import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FriendsService } from './friends.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../shared/user.model';

@Component({
  selector: 'app-friend-bar',
  templateUrl: './friend-bar.component.html',
  styleUrls: ['./friend-bar.component.sass'],
})
export class FriendBarComponent implements OnInit, OnDestroy {
  friends: Observable<User[]> = new Observable<User[]>();
  subscription: Subscription = new Subscription();

  friendsService: FriendsService = inject(FriendsService);
  authService: AuthService = inject(AuthService);

  ngOnInit() {
    this.subscription = this.authService.user.subscribe((user) => {
      if (user) {
        this.friendsService.getFriendsByHttp(user.userId);
        this.friends = this.friendsService.friendsChanged;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
