import {Component, Input, OnDestroy} from '@angular/core';
import {Post} from "../../home/posts/post/post.model";
import {ProfileService} from "../../profile/profile.service";
import {AuthService} from "../../auth/auth.service";
import {UsersService} from "../users.service";
import {Observable, of, Subscription} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-users-posts',
  templateUrl: './users-posts.component.html',
  styleUrls: ['./users-posts.component.sass']
})
export class UsersPostsComponent implements OnDestroy{
  @Input()
  post!: Post;

  isLiked$ = new Observable<boolean>();
  isCollapsed: boolean = true;

  @Input()
  postId!: number;
  images: SafeUrl[] = [];

  constructor(private usersService: UsersService,
              private authService: AuthService
  ) {
  }
  ngOnInit(): void {
    console.log(this.post.postId, this.postId)
    this.isLiked$ = this.usersService.isLiked(this.post.postId, this.post)
    let images = this.usersService.getImageFromBackend(this.post.imagesId);
    if (images != undefined) {
      this.images = images;
    }
  }

  onLikeUp() {
    this.isLiked$ = of(!this.isLiked$);
    if (!this.isLiked$) {
      console.log(this.post)
      this.usersService.likeDown(this.post.postId, this.post);
      return
    } else {
      this.usersService.likeUp(this.post.postId, this.post);
    }
  }

  ngOnDestroy(): void {
  }

}
