import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post.model';
import { map, of } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { PostsService } from '../../posts.service';
import { Comment } from './comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  postService = inject(PostsService);

  baseUrl = 'http://localhost:8080/api/likeComments/';

  isLiked(comment: Comment, post: Post) {
    return this.postService.isLikedComment(comment, post);
  }

  likeDown(commentId: number) {
    this.postService.removeLikeToComment(commentId);
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
    this.postService.addLikeToComment(commentId);
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
