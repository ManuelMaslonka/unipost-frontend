import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../shared/user.model";
import {AuthService} from "../auth/auth.service";
import {Post} from "../home/posts/post/post.model";
import {ProfileService} from "./profile.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user!: User
  posts: Post[] = [];
  following: number = 0;
  // todo create userImages
  imageSrc: string = "assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg";

  userSub = new Subscription();
  profSub = new Subscription();

  constructor(private authService: AuthService,
              private profileService: ProfileService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        if (user && user.userId != null) {
          this.user = user;
          this.profileService.getUserPostByHttp().subscribe()
          this.authService.getFollowingByHttp(user.userId).subscribe(
            following => {
              this.following = following.length;
            }
          )
        }
      }
    )
    this.profSub = this.profileService.postsChanged.subscribe(
        posts => {
        this.posts = posts;
      }
    )
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.profSub.unsubscribe();
  }

}
