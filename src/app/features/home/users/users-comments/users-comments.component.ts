import { Component, Input, OnDestroy } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ProfileCommentsService } from '../../profile/profile-comments/profile-comments.service';
import { AuthService } from '../../../auth/auth.service';
import { UsersCommentsService } from './users-comments.service';
import { Post } from '../../posts/post/post.model';
import { Comment } from '../../posts/post/comment/comment.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-users-comments',
  templateUrl: './users-comments.component.html',
  styleUrls: ['./users-comments.component.sass'],
})
export class UsersCommentsComponent implements OnDestroy {
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
  isEditable: boolean = false;
  userSubs!: Subscription;
  userSubs1!: Subscription;

  constructor(
    private usersCommentsService: UsersCommentsService,
    private authService: AuthService,
  ) {}

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.userSubs1.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubs = this.usersCommentsService
      .isLiked(this.comment, this.post)
      .subscribe((res) => {
        this.isLiked = res;
      });
    this.authorImage = this.authService.getProfileImageUser(
      this.comment.userId,
    );
    this.userSubs1 = this.authService.user.subscribe((user) => {
      if (user) {
        this.isEditable = user.userId === this.comment.userId;
      }
    });
  }

  onLikeUpComment() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      this.usersCommentsService.likeDown(this.comment.commentId);
      return;
    }
    this.usersCommentsService.likeUp(this.comment.commentId);
  }

  onDelete() {
    this.usersCommentsService.deleteComment(this.comment.commentId);
  }
}
