import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post.model';
import { map, of, Subscription } from 'rxjs';
import { PostsService } from '../../posts.service';
import { Comment } from './comment.model';
import { AuthService } from '../../../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CommentService implements OnDestroy {
  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.userSubs1.unsubscribe();
    this.userSubs2.unsubscribe();
  }
  http = inject(HttpClient);
  authService = inject(AuthService);
  postService = inject(PostsService);
  userSubs!: Subscription;
  userSubs1!: Subscription;
  userSubs2!: Subscription;

  baseUrl = 'http://localhost:8080/api/likeComments/';

  isLiked(comment: Comment, post: Post) {
    return this.postService.isLikedComment(comment, post);
  }

  likeDown(commentId: number) {
    this.postService.removeLikeToComment(commentId);
    this.userSubs = this.authService.user.subscribe((user) => {
      if (user) {
        this.http
          .delete(this.baseUrl + 'remove/' + commentId, {})
          .subscribe(() => {
            console.log(' this is add likes');
          });
      }
    });
  }

  likeUp(commentId: number) {
    this.postService.addLikeToComment(commentId);
    this.userSubs1 = this.authService.user.subscribe((user) => {
      if (user) {
        this.http
          .post<boolean>(this.baseUrl + 'add/' + commentId, {})
          .subscribe((resData) => {
            console.log(resData + ' this is add likes');
          });
      }
    });
  }

  deleteComment(commentId: number) {
    this.userSubs2 = this.authService.user.subscribe((user) => {
      if (user) {
        this.http
          .delete<boolean>(
            'http://localhost:8080/api/comments/' + commentId,
            {},
          )
          .subscribe((resData) => {
            console.log(resData + ' this is add likes');
            this.postService.getPostByHttp();
          });
      }
    });
  }
}
