import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { ProfileService } from '../profile.service';
import { Post } from '../../posts/post/post.model';
import { Comment } from '../../posts/post/comment/comment.model';

@Injectable({ providedIn: 'root' })
export class ProfileCommentsService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  profileService = inject(ProfileService);

  baseUrl = 'http://localhost:8080/api/likeComments/';

  isLiked(comment: Comment, post: Post) {
    return this.profileService.isLikedComment(comment, post);
  }

  likeDown(commentId: number) {
    this.profileService.removeLikeToComment(commentId);
    this.authService.user.subscribe((user) => {
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
    this.authService.user.subscribe((user) => {
      if (user) {
        this.http
          .post<boolean>(this.baseUrl + 'add/' + commentId, {})
          .subscribe((resData) => {
            console.log(resData + ' this is add likes');
          });
      }
    });
  }
}
