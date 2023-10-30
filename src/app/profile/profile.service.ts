import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Subject, Subscription, tap} from "rxjs";
import {Post} from "../home/posts/post/post.model";
import {User} from "../shared/user.model";
import {AuthService} from "../auth/auth.service";
import {Comment} from "../home/posts/post/comment/comment.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Injectable({providedIn: "root"})
export class ProfileService {

  private BASE_URL: string = 'http://localhost:8080/api/';
  user!: User;
  postsChanged: Subject<Post[]> = new Subject<Post[]>();
  postsList: Post[] = []
  pageMax = new BehaviorSubject<number>(0);
  private userSub: Subscription = new Subscription();
  private userSub1: Subscription = new Subscription();
  private userSub2: Subscription = new Subscription();
  private userSub3: Subscription = new Subscription();


  constructor(private http: HttpClient,
              private authService: AuthService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        if (user != null) {
          this.user = user;
        }
      }
    )
  }

  getUserPostByHttp(userId: number) {
    return this.http.get<Post[]>(
      this.BASE_URL + 'posts/user/' + userId
    ).pipe(
      tap(
        resData => {
          this.postsList = resData;
          this.updatePosts();
        }
      )
    )
  }

  getUserByIdHttp(userId: number) {
    return this.http.get<User>(
      this.BASE_URL + 'users/' + userId
    )
  }

  updatePosts() {
    this.postsChanged.next(this.postsList.slice());
  }


  likeUp(postId: number, post: Post) {
    console.log(postId)
    console.log(post)
    this.postsList[this.postsList.indexOf(post)].likeCount++;
    this.userSub1 = this.authService.user.subscribe(
      user => {
        if (user) {
          console.log('Starting likeUp ')
          this.http.post<boolean>(
            this.BASE_URL + "likes/add/" + user.userId + "/" + postId, {}
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
            this.BASE_URL + "likes/remove/" + user.userId + "/" + postId, {}
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
    return this.postsList[postId];
  }


  commentLikeUp(postId: number, commentId: number) {
    this.postsList[postId].comments[commentId].likeCount++
    this.updatePosts();
  }

  commentLikeDown(postId: number, commentId: number) {
    this.postsList[postId].comments[commentId].likeCount--
    this.updatePosts();
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

  addComment(comment: Comment, postId: number) {
    let post = this.postsList.find(post => post.postId === postId)
    if (post != undefined) {
      this.postsList[this.postsList.indexOf(post)].comments.unshift(comment);
    }
    this.sendCommentToServer(comment.description, postId);
  }


  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.userSub1.unsubscribe();
    this.userSub2.unsubscribe();
    this.userSub3.unsubscribe();
  }


  sendCommentToServer(content: string, postId: number) {
    this.userSub3 = this.authService.user.subscribe(
      user => {
        if (user) {
          console.log(user.userId)
          this.http.post<any>(
            this.BASE_URL + "comments/create/" + user.userId + "/" + postId, {
              'content': content
            }
          ).subscribe(resData => {
            console.log(resData)
          })

        }
      }
    )
  }

  getImageFromBackend(imagesId: number[]) {
    let images: Blob[] = [];
    if (imagesId == null) {
      return
    }
    imagesId.forEach(
      id => {
        this.http.get<Blob>(
          this.BASE_URL + "images/" + id, {
            responseType: 'blob' as 'json'
          }
        ).subscribe(
          blob => {
            images.push(blob);
          }
        )
      }
    )
    return images;
  }
}
