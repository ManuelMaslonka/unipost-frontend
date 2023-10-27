import {Component, Input} from '@angular/core';
import {Post} from "../../home/posts/post/post.model";
import {ProfileService} from "../../profile/profile.service";
import {AuthService} from "../../auth/auth.service";
import {UsersService} from "../users.service";

@Component({
  selector: 'app-users-posts',
  templateUrl: './users-posts.component.html',
  styleUrls: ['./users-posts.component.sass']
})
export class UsersPostsComponent {
  @Input()
  post!: Post;

  isLiked: boolean = false;
  isCollapsed: boolean = true;

  @Input()
  postId!: number;

  constructor(private usersService: UsersService,
              private authService: AuthService
  ) {
  }
  ngOnInit(): void {
    console.log(this.post.postId, this.postId)
    this.usersService.isLiked(this.post.postId, this.post).subscribe(
      isLiked => {
        this.isLiked = isLiked
      }
    )
  }

  onLikeUp() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      console.log(this.post)
      this.usersService.likeDown(this.post.postId, this.post);
      return
    } else {
      this.usersService.likeUp(this.post.postId, this.post);
    }
  }

}
