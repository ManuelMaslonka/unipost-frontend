import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ProfileCommentsService } from '../../profile/profile-comments/profile-comments.service';
import { AuthService } from '../../../auth/auth.service';
import { UsersCommentsService } from './users-comments.service';
import { Post } from '../../posts/post/post.model';
import { Comment } from '../../posts/post/comment/comment.model';
@Component({
  selector: 'app-users-comments',
  templateUrl: './users-comments.component.html',
  styleUrls: ['./users-comments.component.sass'],
})
export class UsersCommentsComponent {
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
    private usersCommentsService: UsersCommentsService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.usersCommentsService
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
      this.usersCommentsService.likeDown(this.comment.commentId);
      return;
    }
    this.usersCommentsService.likeUp(this.comment.commentId);
  }
}
