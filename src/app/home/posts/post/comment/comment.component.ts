import {
  Component,
  inject,
  Input
} from '@angular/core';
import {Comment}      from "./comment.model";
import {PostsService} from "../../posts.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass']
})
export class CommentComponent {

  @Input()
  comment?: Comment;

  @Input()
  commentId!: number;

  @Input()
  postId!: number;

  isLiked: boolean = false;
  isDisliked: boolean = false;
  isClicked: boolean = false

  postsService: PostsService = inject(PostsService)

  onSwitchLike(like: string) {

    let direction: boolean = like === 'Like'

    if (this.postsService.postsList[this.postId].comment[this.commentId].liked && this.postsService.postsList[this.postId].comment[this.commentId].direction === like) {
      return
    }

    this.postsService.likedComment(direction, this.postId, this.commentId)
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
