import {
  Component,
  inject,
  Input
} from '@angular/core';
import {Post}         from "./post.model";
import {PostsService} from "../posts.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.sass']
})
export class PostComponent {

  @Input()
  post?: Post;

  isLiked: boolean = false;
  isDisliked: boolean = false;
  isClicked: boolean = false
  isCollapsed: boolean = true;

  @Input()
  postId!: number;

  postsService: PostsService = inject(PostsService)

  onSwitchLike(like: string) {

    let direction: boolean = like === 'Like'

    if (this.postsService.postsList[this.postId].liked && this.postsService.postsList[this.postId].direction === like) {
      return
    }

    this.postsService.liked(direction, this.postId)
    if (like === 'Like') {
      this.isClicked = true;
      this.isLiked = true;
      this.isDisliked = false;
    } else if (like === 'Dislike') {
      this.isClicked = true;
      this.isLiked = false;
      this.isDisliked = true;
    } else {
      this.isClicked = false;
    }
  }
}
