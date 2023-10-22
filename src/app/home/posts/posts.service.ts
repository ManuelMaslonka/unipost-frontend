import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {Post} from "./post/post.model";
import {Comment} from "./post/comment/comment.model";
import {map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../shared/user.model";

@Injectable({
  providedIn: 'root'
})
export class PostsService implements OnInit, OnDestroy {

  private baseUrl: string = 'http://localhost:8080/api/';
  user!: User;
  postsChanged: Subject<Post[]> = new Subject<Post[]>();

  postsList: Post[] = [
    // new Post(12, "sadasd", "asdsa", 12, new Date(), "asda/asddsa", [], [], false, "Manuel Maslonka")
  ];

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

  likeUp(postId: number) {
    this.postsList[postId].likeCount++;
    postId += 1;
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

  likeDown(postId: number) {
    this.postsList[postId].likeCount--;
    postId += 1;
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

  isLiked(postId: number) {
    return this.authService.user.pipe(map(user => {
      if (user != null) {
        for (let i = 0; i < this.postsList[postId].likes.length; i++) {
          if (this.postsList[postId].likes[i].userId != null && this.postsList[postId].likes[i].userId === user.userId) {
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
