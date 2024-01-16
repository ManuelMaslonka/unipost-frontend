import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { ProfileService } from '../../profile/profile.service';
import { UsersService } from '../users.service';
import { Post } from '../../posts/post/post.model';
import { Comment } from '../../posts/post/comment/comment.model';

@Injectable({ providedIn: 'root' })
export class UsersCommentsService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  usersService = inject(UsersService);

  baseUrl = 'http://localhost:8080/api/likeComments/';

  isLiked(comment: Comment, post: Post) {
    return this.usersService.isLikedComment(comment, post);
  }

  likeDown(commentId: number) {
    this.usersService.removeLikeToComment(commentId);
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
    this.usersService.addLikeToComment(commentId);
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
