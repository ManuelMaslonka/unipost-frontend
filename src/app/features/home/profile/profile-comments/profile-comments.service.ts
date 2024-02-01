import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { ProfileService } from '../profile.service';
import { Post } from '../../posts/post/post.model';
import { Comment } from '../../posts/post/comment/comment.model';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileCommentsService implements OnDestroy {
  http = inject(HttpClient);
  authService = inject(AuthService);
  profileService = inject(ProfileService);
  userSubs!: Subscription;
  userSubs1!: Subscription;
  userSubs2!: Subscription;

  baseUrl = 'http://localhost:8080/api/likeComments/';

  isLiked(comment: Comment, post: Post) {
    return this.profileService.isLikedComment(comment, post);
  }

  likeDown(commentId: number) {
    this.profileService.removeLikeToComment(commentId);
    this.userSubs1 = this.authService.user.subscribe((user) => {
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
    this.profileService.addLikeToComment(commentId);
    this.userSubs = this.authService.user.subscribe((user) => {
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
