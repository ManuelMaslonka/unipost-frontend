import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { ProfileService } from '../../profile/profile.service';
import { UsersService } from '../users.service';
import { Post } from '../../posts/post/post.model';
import { Comment } from '../../posts/post/comment/comment.model';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersCommentsService implements OnDestroy {
  http = inject(HttpClient);
  authService = inject(AuthService);
  usersService = inject(UsersService);
  postService = inject(ProfileService);
  userSubs!: Subscription;
  userSubs1!: Subscription;
  userSubs2!: Subscription;
  baseUrl = 'http://localhost:8080/api/likeComments/';

  isLiked(comment: Comment, post: Post) {
    return this.usersService.isLikedComment(comment, post);
  }

  likeDown(commentId: number) {
    this.usersService.removeLikeToComment(commentId);
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
    this.usersService.addLikeToComment(commentId);
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
            this.usersService.getUserPostByHttp(user.userId);
          });
      }
    });
  }
  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.userSubs1.unsubscribe();
    this.userSubs2.unsubscribe();
  }
}
