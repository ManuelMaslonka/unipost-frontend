import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {Post} from "./post/post.model";
import {Comment} from "./post/comment/comment.model";
import {BehaviorSubject, map, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../shared/user.model";
import {PostPagination} from "../../shared/postPagination.model";

@Injectable({
  providedIn: 'root'
})
export class PostsService implements OnInit, OnDestroy {

  private baseUrl: string = 'http://localhost:8080/api/';
  user!: User;
  postsChanged: Subject<Post[]> = new Subject<Post[]>();
  postsList: Post[] = []
  pageMax = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user.subscribe(
      user => {
        if (user != null) {
          this.user = user;
        }
      }
    )
  }

  addPost(content: string, isPrivate: string, imagePath: string) {
    this.authService.user.subscribe(
      user => {
        if (user != null) {
          this.sendPostToBackend(content, isPrivate, imagePath, user.userId);
        }
      }
    )
    this.getPostByHttp();
  }

  getPosts() {
    return this.postsList.slice();
  }

  addComment(postId: number, comment: Comment) {
    this.postsList[postId].comments.unshift(comment);
  }

  updatePosts() {
    this.postsChanged.next(this.postsList.slice());
  }

  getPostByHttp() {
    this.http.get<Post[]>(
      this.baseUrl + "posts",
    ).subscribe(resData => {
      this.postsList = resData;
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
    console.log(postId)
    console.log(post)
    this.postsList[this.postsList.indexOf(post)].likeCount++;
    this.authService.user.subscribe(
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

    this.authService.user.subscribe(
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

  private sendPostToBackend(content: string, isPrivate: string, imagePath: string,
                            userId: number) {

    this.http.post<boolean>(
      this.baseUrl + "posts/create/" + userId, {
        content: content,
        isPrivate: isPrivate,
        imagePath: imagePath
      }
    ).subscribe(resData => {
      this.getPostByHttp()
    })
  }

  ngOnDestroy() {
  }

}
