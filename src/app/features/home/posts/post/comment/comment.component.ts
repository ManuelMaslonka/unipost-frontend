import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Comment } from './comment.model';
import { PostsService } from '../../posts.service';
import { CommentService } from './comment.service';
import { SafeUrl } from '@angular/platform-browser';
import { Post } from '../post.model';
import { AuthService } from '../../../../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass'],
})
export class CommentComponent implements OnInit, OnDestroy {
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
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.userSubs1.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubs = this.commentService
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
      this.commentService.likeDown(this.comment.commentId);
      return;
    }
    this.commentService.likeUp(this.comment.commentId);
  }
  onDelete() {
    this.commentService.deleteComment(this.comment.commentId);
  }
}
