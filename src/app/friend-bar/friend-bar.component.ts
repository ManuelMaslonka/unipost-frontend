import {
  Component,
  OnInit
} from '@angular/core';
import {Friend}      from "./friend.model";
import {FriendsService} from "./friends.service";

@Component({
  selector: 'app-friend-bar',
  templateUrl: './friend-bar.component.html',
  styleUrls: ['./friend-bar.component.sass']
})
export class FriendBarComponent implements OnInit{
  friends: Friend[] = []

  constructor(private friendsService: FriendsService) {
  }

  ngOnInit() {
    this.friends = this.friendsService.friends;
  }
}
