import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Subject, Subscription, tap } from 'rxjs';
import { User } from '../../../shared/user.model';
import { AuthService } from '../../auth/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Post } from '../posts/post/post.model';
import { Comment } from '../posts/post/comment/comment.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private BASE_URL: string = 'http://localhost:8080/api/';
  user!: User;
  postsChanged: Subject<Post[]> = new Subject<Post[]>();
  postsList: Post[] = [];
  pageMax = new BehaviorSubject<number>(0);
  private userSub: Subscription = new Subscription();
  private userSub1: Subscription = new Subscription();
  private userSub2: Subscription = new Subscription();
  private postSub: Subscription = new Subscription();
  private delSub: Subscription = new Subscription();
  private getSub: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user != null) {
        this.user = user;
      }
    });
  }

  getUserPostByHttp() {
    return this.http.get<Post[]>(this.BASE_URL + 'posts/user').pipe(
      tap((resData) => {
        this.postsList = resData;
        this.updatePosts();
      }),
    );
  }

  getUserByIdHttp(userId: number) {
    return this.http.get<User>(this.BASE_URL + 'users/' + userId);
  }

  updatePosts() {
    this.postsChanged.next(this.postsList.slice());
  }

  likeUp(postId: number, post: Post) {
    console.log(postId);
    console.log(post);
    this.postsList[this.postsList.indexOf(post)].likeCount++;
    this.userSub1 = this.http
      .post<boolean>(this.BASE_URL + 'likes/add/' + postId, {})
      .subscribe((resData) => {
        console.log(resData + ' this is add likes');
      });
  }

  likeDown(postId: number, post: Post) {
    this.postsList[this.postsList.indexOf(post)].likeCount--;

    this.userSub2 = this.http
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
    let post = this.postsList.find((post) => post.postId === postId);
    if (post != undefined) {
      this.postsList[this.postsList.indexOf(post)].comments.unshift(comment);
    }
    this.sendCommentToServer(comment.description, postId);
    this.getSub = this.getUserPostByHttp().subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.userSub1.unsubscribe();
    this.userSub2.unsubscribe();
    this.postSub.unsubscribe();
    this.delSub.unsubscribe();
    this.getSub.unsubscribe();
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

  deletePost(postId: number) {
    this.delSub = this.http
      .delete<boolean>(this.BASE_URL + 'posts/delete/' + postId)
      .subscribe((resData) => {
        this.getUserPostByHttp().subscribe();
      });
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
