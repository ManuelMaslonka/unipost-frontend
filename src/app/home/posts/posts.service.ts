import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {Post} from "./post/post.model";
import {Comment} from "./post/comment/comment.model";
import {BehaviorSubject, map, Subject, Subscription, tap} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../shared/user.model";
import {PostPagination} from "../../shared/postPagination.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class PostsService implements OnInit, OnDestroy {

  private baseUrl: string = 'http://localhost:8080/api/';
  user!: User;
  postsChanged: Subject<Post[]> = new Subject<Post[]>();
  postsList: Post[] = []
  pageMax = new BehaviorSubject<number>(0);
  private userSub = new Subscription();
  private userSub1 = new Subscription();
  private userSub2 = new Subscription();
  private userSub3 = new Subscription();
  private httpSub = new Subscription();

  constructor(private http: HttpClient,
              private authService: AuthService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.userSub3 = this.authService.user.subscribe(
      user => {
        if (user != null) {
          this.user = user;
        }
      }
    )
  }

  addPost(content: string, formData: FormData) {
    this.userSub = this.authService.user.subscribe(
      user => {
        if (user != null) {
          this.sendPostToBackend(content, formData, user.userId);
        }
      }
    )
    this.getPostByHttp();
  }

  getPosts() {
    return this.postsList.slice();
  }

  addComment(postId: number, comment: Comment) {
    let post = this.postsList.find(post => post.postId === postId)
    if (post != undefined) {
      this.postsList[this.postsList.indexOf(post)].comments.unshift(comment);
    }
  }

  updatePosts() {
    this.postsChanged.next(this.postsList.slice());
  }

  getPostByHttp() {
    this.http.get<Post[]>(
      this.baseUrl + "posts",
    ).subscribe(resData => {
      this.postsList = resData;
      console.log(this.postsList);
      this.updatePosts();
    })
  }

  getPostByHttpPagination(page: number = 0, size: number = 5) {
    let paramsHttp = new HttpParams();
    paramsHttp.append("page", page);
    paramsHttp.append("size", size);
    console.log(paramsHttp)
    this.http.get<PostPagination>(
      this.baseUrl + "posts", {
        params: new HttpParams().set("page", page).set("size", size)
      }
    ).subscribe(resData => {
      console.log(resData)
      if (page == 0) {
        this.postsList = resData.post;
      } else {
        this.postsList.push(...resData.post)
      }
      this.pageMax.next(resData.totalPages);
      this.updatePosts();
    })
  }

  likeUp(postId: number, post: Post) {
    this.postsList[this.postsList.indexOf(post)].likeCount++;
    this.userSub1 = this.authService.user.subscribe(
      user => {
        if (user) {
          console.log('Starting likeUp ')
          this.http.post<boolean>(
            this.baseUrl + "likes/add/" + user.userId + "/" + postId, {}
          ).subscribe(
            resData => {
              console.log(resData + " this is add likes")
            }
          )

        }
      }
    )
  }

  likeDown(postId: number, post: Post) {

    this.postsList[this.postsList.indexOf(post)].likeCount--;

    this.userSub2 = this.authService.user.subscribe(
      user => {
        if (user) {
          console.log('Starting likeUp ')
          this.http.post<boolean>(
            this.baseUrl + "likes/remove/" + user.userId + "/" + postId, {}
          ).subscribe(
            resData => {
              console.log(resData + " this is add likes")
            }
          )

        }
      }
    )
  }

  getPostById(postId: number) {
    return this.postsList.find(post => post.postId === postId)
  }


  commentLikeUp(postId: number, commentId: number) {
    console.log(commentId);
    console.log(postId);
  }

  commentLikeDown(postId: number, comment: number) {
    // this.postsList[postId].comments[commentId].likeCount--
    // this.updatePosts();
  }

  isLiked(postId: number, post: Post) {
    let indexOfPost = this.postsList.indexOf(post)
    return this.authService.user.pipe(map(user => {
      if (user != null) {
        for (let i = 0; i < this.postsList[indexOfPost].likes.length; i++) {
          if (this.postsList[indexOfPost].likes[i].userId === user.userId) {
            return true
          }
        }
      }
      return false
    }))
  }

  private sendPostToBackend(content: string, formdata: FormData, userId: number) {

    formdata.append('content', content);

    this.httpSub = this.http.post<boolean>(
      this.baseUrl + "posts/create/" + userId, formdata, {
        headers: new HttpHeaders("Content-Type: multipart/form-data")
      }
    ).subscribe(resData => {
      this.getPostByHttp()
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.userSub1.unsubscribe();
    this.userSub2.unsubscribe();
    this.userSub3.unsubscribe();
    this.httpSub.unsubscribe();
  }

  sendCommentToBackend(commentContent: string, postId: number, userId: number) {
    return this.http.post<any>(
      this.baseUrl + "comments/create/" + userId + "/" + postId, {
        'content': commentContent
      }
    ).pipe(
      tap(resData => {

        }
      )
    )
  }

  getImageFromBackend(imagesId: number[]) {
    let images: SafeUrl[] = [];
    let imagesAndCounter: [SafeUrl, number][] = [];
    if (imagesId == null) {
      return
    }
    imagesId.forEach(
      id => {
        this.http.get<Blob>(
          this.baseUrl + "images/" + id, {
            responseType: 'blob' as 'json'
          }
        ).subscribe(
          blob => {
            let objectURL = URL.createObjectURL(blob);
            let image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            images.push(image);
          }
        )
      }
    )
    return images;
  }
}
