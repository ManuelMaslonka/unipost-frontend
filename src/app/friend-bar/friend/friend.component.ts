import {Component, inject, Input, OnInit} from '@angular/core';
import {User} from "../../shared/user.model";
import {SafeUrl} from "@angular/platform-browser";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.sass']
})
export class FriendComponent implements OnInit{

  @Input() friend!: User;

  images!: SafeUrl[];

  authService: AuthService = inject(AuthService)

  ngOnInit(): void {

    this.images = this.authService.getProfileImageUser(this.friend.userId);

  }



}
