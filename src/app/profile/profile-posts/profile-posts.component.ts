import {Component, Input, OnDestroy} from '@angular/core';
import {Post} from "../../home/posts/post/post.model";
import {ProfileService} from "../profile.service";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

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

  @Input()
  postId!: number;

  constructor(private profileService: ProfileService,
              private authService: AuthService
  ) {
  }
  ngOnInit(): void {
    this.profSub = this.profileService.isLiked(this.post.postId, this.post).subscribe(
      isLiked => {
        this.isLiked = isLiked
      }
    )
  }

  onLikeUp() {
    this.isLiked = !this.isLiked;
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
