import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post/post.model';
import { Comment } from './post/comment/comment.model';
import { BehaviorSubject, map, Subject, Subscription, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User } from '../../../shared/user.model';
import { AuthService } from '../../auth/auth.service';
import { PostPagination } from '../../../shared/postPagination.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService implements OnInit, OnDestroy {
  private baseUrl: string = 'http://localhost:8080/api/';
  user!: User;
  postsChanged: Subject<Post[]> = new Subject<Post[]>();
  postsList: Post[] = [];
  pageMax = new BehaviorSubject<number>(0);
  private userSub = new Subscription();
  private userSub1 = new Subscription();
  private userSub2 = new Subscription();
  private userSub3 = new Subscription();
  private httpSub = new Subscription();
  private delSub = new Subscription();
  private getSub = new Subscription();
  private getSub1 = new Subscription();
  private getSub2 = new Subscription();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.userSub3 = this.authService.user.subscribe((user) => {
      if (user != null) {
        this.user = user;
      }
    });
  }

  addPost(content: string, formData: FormData) {
    this.sendPostToBackend(content, formData);
    this.getPostByHttp();
  }

  getPosts() {
    return this.postsList.slice();
  }

  getFollowedPostsFromBackend() {
    this.getSub1 = this.http
      .get<Post[]>(this.baseUrl + 'posts/followed')
      .subscribe((resData) => {
        this.postsList = resData;
        console.log(this.postsList);
        this.updatePosts();
      });
  }

  addComment(postId: number, comment: Comment) {
    let post = this.postsList.find((post) => post.postId === postId);
    if (post != undefined) {
      this.postsList[this.postsList.indexOf(post)].comments.unshift(comment);
    }
  }

  updatePosts() {
    this.postsChanged.next(this.postsList.slice());
  }

  getPostByHttp() {
    this.getSub2 = this.http
      .get<Post[]>(this.baseUrl + 'posts')
      .subscribe((resData) => {
        this.postsList = resData;
        console.log(this.postsList);
        this.updatePosts();
      });
  }

  getPostByHttpPagination(page: number = 0, size: number = 5) {
    let paramsHttp = new HttpParams();
    paramsHttp.append('page', page);
    paramsHttp.append('size', size);
    this.getSub = this.http
      .get<PostPagination>(this.baseUrl + 'posts', {
        params: new HttpParams().set('page', page).set('size', size),
      })
      .subscribe((resData) => {
        if (page == 0) {
          this.postsList = resData.post;
        } else {
          this.postsList.push(...resData.post);
        }
        this.pageMax.next(resData.totalPages);
        this.updatePosts();
      });
  }

  likeUp(postId: number, post: Post) {
    this.postsList[this.postsList.indexOf(post)].likeCount++;
    this.userSub1 = this.authService.user.subscribe((user) => {
      if (user) {
        console.log('Starting likeUp ');
        this.http
          .post<boolean>(this.baseUrl + 'likes/add/' + postId, {})
          .subscribe((resData) => {
            console.log(resData + ' this is add likes');
          });
      }
    });
  }

  likeDown(postId: number, post: Post) {
    this.postsList[this.postsList.indexOf(post)].likeCount--;

    this.userSub2 = this.authService.user.subscribe((user) => {
      if (user) {
        console.log('Starting likeUp ');
        this.http
          .post<boolean>(this.baseUrl + 'likes/remove/' + postId, {})
          .subscribe((resData) => {
            console.log(resData + ' this is add likes');
          });
      }
    });
  }

  getPostById(postId: number) {
    return this.postsList.find((post) => post.postId === postId);
  }

  getPostByIdForComments(postId: number) {
    for (let i = 0; i < this.postsList.length; i++) {
      if (this.postsList[i].postId === postId) {
        return this.postsList[i];
      }
    }
    return null;
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

  private sendPostToBackend(content: string, formdata: FormData) {
    formdata.append('content', content);

    this.httpSub = this.http
      .post<boolean>(this.baseUrl + 'posts/create', formdata, {
        headers: new HttpHeaders('Content-Type: multipart/form-data'),
      })
      .subscribe((resData) => {
        this.getPostByHttp();
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.userSub1.unsubscribe();
    this.userSub2.unsubscribe();
    this.userSub3.unsubscribe();
    this.httpSub.unsubscribe();
    this.delSub.unsubscribe();
    this.getSub.unsubscribe();
    this.getSub1.unsubscribe();
    this.getSub2.unsubscribe();
  }

  sendCommentToBackend(commentContent: string, postId: number) {
    return this.http.post<any>(this.baseUrl + 'comments/create/' + postId, {
      content: commentContent,
    });
  }

  getImageFromBackend(imagesId: number[]) {
    let images: SafeUrl[] = [];
    if (imagesId == null) {
      return;
    }
    imagesId.forEach((id) => {
      this.http
        .get<Blob>(this.baseUrl + 'images/' + id, {
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
      .delete<boolean>(this.baseUrl + 'posts/delete/' + postId)
      .pipe(
        tap(() => {
          this.getPostByHttp();
        }),
      )
      .subscribe();
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
