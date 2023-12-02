import { Component, inject, Input, OnInit } from '@angular/core';
import { Comment } from './comment.model';
import { PostsService } from '../../posts.service';
import { CommentService } from './comment.service';
import { AuthService } from '../../../../auth/auth.service';
import { SafeUrl } from '@angular/platform-browser';
import { Post } from '../post.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass'],
})
export class CommentComponent implements OnInit {
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
    private CommentService: CommentService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.CommentService.isLiked(this.comment, this.post).subscribe((res) => {
      this.isLiked = res;
    });
    this.authorImage = this.authService.getProfileImageUser(
      this.comment.userId,
    );
  }

  onLikeUpComment() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      this.CommentService.likeDown(this.comment.commentId);
      return;
    }
    this.CommentService.likeUp(this.comment.commentId);
  }
}
