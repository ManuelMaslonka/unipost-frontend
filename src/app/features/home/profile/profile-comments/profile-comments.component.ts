import { Component, Input, OnDestroy } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ProfileCommentsService } from './profile-comments.service';
import { AuthService } from '../../../auth/auth.service';
import { Post } from '../../posts/post/post.model';
import { Comment } from '../../posts/post/comment/comment.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-comments',
  templateUrl: './profile-comments.component.html',
  styleUrls: ['./profile-comments.component.sass'],
})
export class ProfileCommentsComponent implements OnDestroy {
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
  userSubs1!: Subscription;
  userSubs!: Subscription;

  constructor(
    private profileCommentsService: ProfileCommentsService,
    private authService: AuthService,
  ) {}

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.userSubs1.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubs = this.profileCommentsService
      .isLiked(this.comment, this.post)
      .subscribe((res) => {
        this.isLiked = res;
      });
    this.authorImage = this.authService.getProfileImageUser(
      this.comment.userId,
    );
    this.userSubs1 = this.authService.user.subscribe((user) => {
      if (user) {
        this.isEditable = user.userId == this.comment.userId;
      }
    });
  }

  onLikeUpComment() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      this.profileCommentsService.likeDown(this.comment.commentId);
      return;
    }
    this.profileCommentsService.likeUp(this.comment.commentId);
  }

  onDelete() {
    this.profileCommentsService.deleteComment(this.comment.commentId);
  }
}
