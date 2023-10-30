import {Component, Input, OnDestroy} from '@angular/core';
import {Post} from "../../home/posts/post/post.model";
import {ProfileService} from "../profile.service";
import {AuthService} from "../../auth/auth.service";
import {Observable, of, Subscription} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.sass']
})
export class ProfilePostsComponent implements OnDestroy{

  @Input()
  post!: Post;

  isLiked: boolean = false;
  isCollapsed: boolean = true;
  profSub = new Subscription();
  isLiked$: Observable<boolean> = new Observable<boolean>();

  @Input()
  postId!: number;
  images: SafeUrl[] = [];

  constructor(private profileService: ProfileService,
              private authService: AuthService
  ) {
  }
  ngOnInit(): void {
    this.isLiked$ = this.profileService.isLiked(this.post.postId, this.post);
    let images = this.profileService.getImageFromBackend(this.post.imagesId);
    if (images != undefined) {
      this.images = images;
    }
  }

  onLikeUp() {
    this.isLiked$ = of(!this.isLiked$);
    if (!this.isLiked) {
      console.log(this.post)
      this.profileService.likeDown(this.post.postId, this.post);
      return
    } else {
      this.profileService.likeUp(this.post.postId, this.post);
    }
  }

  ngOnDestroy(): void {
    this.profSub.unsubscribe();
  }



}
