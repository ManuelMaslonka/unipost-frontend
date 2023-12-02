import { Component, Input } from '@angular/core';
import { Post } from '../../home/posts/post/post.model';
import { SafeUrl } from '@angular/platform-browser';
import { ProfileCommentsService } from './profile-comments.service';
import { AuthService } from '../../auth/auth.service';
import { Comment } from '../../home/posts/post/comment/comment.model';

@Component({
  selector: 'app-profile-comments',
  templateUrl: './profile-comments.component.html',
  styleUrls: ['./profile-comments.component.sass'],
})
export class ProfileCommentsComponent {
  @Input()
  comment!: Comment;

  @Input()
  index!: number;

  @Input()
  postId!: number;

  @Input()
  post!: Post;

  isLiked: boolean = false;
  authorImage!: SafeUrl[];

  constructor(
    private profileCommentsService: ProfileCommentsService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.profileCommentsService
      .isLiked(this.comment, this.post)
      .subscribe((res) => {
        this.isLiked = res;
      });
    this.authorImage = this.authService.getProfileImageUser(
      this.comment.userId,
    );
  }

  onLikeUpComment() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      this.profileCommentsService.likeDown(this.comment.commentId);
      return;
    }
    this.profileCommentsService.likeUp(this.comment.commentId);
  }
}
