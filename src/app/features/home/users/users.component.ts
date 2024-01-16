import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/user.model';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { Post } from '../posts/post/post.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass'],
})
export class UsersComponent implements OnInit, OnDestroy {
  user!: User;
  posts: Post[] = [];
  imageSrc: string =
    'assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg';
  following: number = 0;
  isFollowing: boolean = false;

  routeSub = new Subscription();
  postSub = new Subscription();
  imageAuthor!: SafeUrl[];

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.usersService.getUserByIdHttp(params['id']).subscribe((user) => {
        this.user = user;
        this.imageAuthor = this.authService.getProfileImageUser(
          this.user.userId,
        );
        this.usersService.getUserPostByHttp(user.userId).subscribe((posts) => {
          this.posts = posts;
        });
        this.usersService
          .getFollowingByHttp(user.userId)
          .subscribe((following) => {
            this.following = following.length;
          });
        this.authService.user.subscribe((loginUser) => {
          if (loginUser) {
            this.usersService
              .getIsFollowingByHttp(loginUser.userId, user.userId)
              .subscribe((isFollowing) => {
                this.isFollowing = isFollowing;
              });
          }
        });
      });
    });
    this.postSub = this.usersService.postsChanged.subscribe((posts) => {
      this.posts = posts;
    });
  }

  switchFollow() {
    if (this.isFollowing) {
      this.usersService.unFollow(this.user.userId);
      this.isFollowing = false;
    } else {
      this.usersService.followUser(this.user.userId);
      this.isFollowing = true;
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.postSub.unsubscribe();
  }
}
