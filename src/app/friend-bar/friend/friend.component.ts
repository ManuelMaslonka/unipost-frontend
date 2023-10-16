import {Component, Input} from '@angular/core';
import {User} from "../../shared/user.model";

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.sass']
})
export class FriendComponent {

  @Input() friend!: User;

}
