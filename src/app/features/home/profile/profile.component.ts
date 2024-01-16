import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/user.model';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from './profile.service';
import { Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { Post } from '../posts/post/post.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User;
  posts: Post[] = [];
  following: number = 0;
  images!: SafeUrl[];
  userSub = new Subscription();
  profSub = new Subscription();

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user && user.userId != null) {
        this.user = user;
        console.log(user.followers.length);
        this.profileService.getUserPostByHttp().subscribe();
        this.images = this.authService.getProfileImageLoggedUser();
        this.authService
          .getFollowingByHttp(user.userId)
          .subscribe((following) => {
            console.log(following.length);
            this.following = following.length;
          });
      }
    });
    this.profSub = this.profileService.postsChanged.subscribe((posts) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.profSub.unsubscribe();
  }
}
