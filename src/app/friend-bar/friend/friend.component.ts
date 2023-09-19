import {
  Component,
  Input
} from '@angular/core';
import {Friend}      from "../friend.model";

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.sass']
})
export class FriendComponent {

  @Input() friend!: Friend;

}
