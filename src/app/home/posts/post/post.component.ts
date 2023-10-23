import {
  Component,
  inject,
  Input, OnInit
} from '@angular/core';
import {Post}         from "./post.model";
import {PostsService} from "../posts.service";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.sass']
})
export class PostComponent implements OnInit{

  @Input()
  post!: Post;

  isLiked: boolean = false;
  isCollapsed: boolean = true;

  @Input()
  postId!: number;

  constructor(private postsService: PostsService,
              private authService: AuthService
            ) {
  }
  ngOnInit(): void {
    this.postsService.isLiked(this.post.postId, this.post).subscribe(
      isLiked => {
        this.isLiked = isLiked
      }
    )
  }

  onLikeUp() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      console.log(this.post)
      this.postsService.likeDown(this.post.postId, this.post);
      return
    } else {
      this.postsService.likeUp(this.post.postId, this.post);
    }
  }

}
