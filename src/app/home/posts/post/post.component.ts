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
  post?: Post;

  isLiked: boolean = false;
  isCollapsed: boolean = true;

  @Input()
  postId!: number;

  constructor(private postsService: PostsService,
              private authService: AuthService
            ) {
  }
  ngOnInit(): void {
    this.postsService.isLiked(this.postId).subscribe(
      isLiked => {
        this.isLiked = isLiked
      }
    )
  }

  onLikeUp() {
    this.isLiked = !this.isLiked;

    if (!this.isLiked) {
      this.postsService.likeDown(this.postId);
      return
    } else {
      this.postsService.likeUp(this.postId);
    }
  }

}
