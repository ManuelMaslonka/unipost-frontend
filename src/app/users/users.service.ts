import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/user.model';
import { Followers } from '../shared/followers.model';
import { Post } from '../home/posts/post/post.model';
import { map, Subject, Subscription, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Comment } from '../home/posts/post/comment/comment.model';
import { FriendsService } from '../friend-bar/friends.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private BASE_URL: string = 'http://localhost:8080/api/';
  postsList: Post[] = [];
  postsChanged: Subject<Post[]> = new Subject<Post[]>();
  postSub = new Subscription();
  postSub1 = new Subscription();
  postSub2 = new Subscription();
  userSub = new Subscription();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private friendService: FriendsService,
    private sanitizer: DomSanitizer,
  ) {}

  getUserByIdHttp(id: number) {
    return this.http.get<User>(this.BASE_URL + 'users/' + id);
  }

  getFollowingByHttp(userId: number) {
    return this.http.get<Followers[]>(this.BASE_URL + 'followers/' + userId);
  }

  getIsFollowingByHttp(userId: number, id: number) {
    return this.http.get<boolean>(this.BASE_URL + 'users/' + userId + '/' + id);
  }

  getUserPostByHttp(userId: number) {
    return this.http.get<Post[]>(this.BASE_URL + 'posts/user/' + userId).pipe(
      tap((resData) => {
        this.postsList = resData;
        this.updatePosts();
      }),
    );
  }

  updatePosts() {
    this.postsChanged.next(this.postsList.slice());
  }

  likeUp(postId: number, post: Post) {
    console.log(postId);
    console.log(post);
    this.postsList[this.postsList.indexOf(post)].likeCount++;

    this.postSub1 = this.http
      .post<boolean>(this.BASE_URL + 'likes/add/' + postId, {})
      .subscribe((resData) => {
        console.log(resData + ' this is add likes');
      });
  }

  likeDown(postId: number, post: Post) {
    this.postsList[this.postsList.indexOf(post)].likeCount--;
    this.postSub2 = this.http
      .post<boolean>(this.BASE_URL + 'likes/remove/' + postId, {})
      .subscribe((resData) => {
        console.log(resData + ' this is add likes');
      });
  }

  getPostById(postId: number) {
    return this.postsList[postId];
  }

  commentLikeUp(postId: number, commentId: number) {
    this.postsList[postId].comments[commentId].likeCount++;
    this.updatePosts();
  }

  commentLikeDown(postId: number, commentId: number) {
    this.postsList[postId].comments[commentId].likeCount--;
    this.updatePosts();
  }

  isLiked(postId: number, post: Post) {
    let indexOfPost = this.postsList.indexOf(post);
    return this.authService.user.pipe(
      map((user) => {
        if (user != null) {
          for (let i = 0; i < this.postsList[indexOfPost].likes.length; i++) {
            if (this.postsList[indexOfPost].likes[i].userId === user.userId) {
              return true;
            }
          }
        }
        return false;
      }),
    );
  }

  addComment(comment: Comment, postId: number) {
    console.log(this.postsList);

    for (let i = 0; i < this.postsList.length; i++) {
      if (this.postsList[i].postId === postId) {
        this.postsList[i].comments.unshift(comment);
        console.log('comment added');
      }
    }
    this.updatePosts();
    this.sendCommentToServer(comment.description, postId);
  }

  sendCommentToServer(content: string, postId: number) {
    this.postSub = this.http
      .post<any>(this.BASE_URL + 'comments/create/' + postId, {
        content: content,
      })
      .subscribe((resData) => {
        console.log(resData);
      });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.postSub1.unsubscribe();
    this.postSub2.unsubscribe();
    this.userSub.unsubscribe();
  }

  setPosts(posts: Post[]) {
    this.postsList = posts;
    this.updatePosts();
  }

  unFollow(followerId: number) {
    this.authService.user.subscribe((user) => {
      if (user) {
        this.http
          .post<any>(this.BASE_URL + 'followers/remove/' + followerId, {})
          .subscribe((resData) => {
            this.friendService.getFriendsByHttp(user.userId);
          });
      }
    });
  }

  followUser(userId: number) {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.http
          .post<any>(this.BASE_URL + 'followers/add/' + userId, {})
          .subscribe((resData) => {
            this.friendService.getFriendsByHttp(user.userId);
          });
      }
    });
  }

  getImageFromBackend(imagesId: number[]) {
    let images: SafeUrl[] = [];
    if (imagesId == null) {
      return;
    }
    imagesId.forEach((id) => {
      this.http
        .get<Blob>(this.BASE_URL + 'images/' + id, {
          responseType: 'blob' as 'json',
        })
        .subscribe((blob) => {
          let objectURL = URL.createObjectURL(blob);
          let image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          images.push(image);
        });
    });
    return images;
  }

  isLikedComment(comment: Comment, post: Post) {
    let indexOfPost = this.postsList.indexOf(post);
    let indexOfComment = this.postsList[indexOfPost].comments.indexOf(comment);

    return this.authService.user.pipe(
      map((user) => {
        if (user != null) {
          for (
            let i = 0;
            i <
            this.postsList[indexOfPost].comments[indexOfComment]?.likeComments
              .length;
            i++
          ) {
            if (
              this.postsList[indexOfPost].comments[indexOfComment].likeComments[
                i
              ].userId === user.userId
            ) {
              return true;
            }
          }
        }
        return false;
      }),
    );
  }

  removeLikeToComment(commentId: number) {
    this.postsList.forEach((post) => {
      post.comments.forEach((comment) => {
        if (comment.commentId === commentId) {
          comment.likeCount--;
        }
      });
    });
  }
  addLikeToComment(commentId: number) {
    this.postsList.forEach((post) => {
      post.comments.forEach((comment) => {
        if (comment.commentId === commentId) {
          comment.likeCount++;
        }
      });
    });
  }
}
