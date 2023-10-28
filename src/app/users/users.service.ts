import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../shared/user.model";
import {Followers} from "../shared/followers.model";
import {Post} from "../home/posts/post/post.model";
import {map, Subject, tap} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {Comment} from "../home/posts/post/comment/comment.model";
import {FriendsService} from "../friend-bar/friends.service";


@Injectable({providedIn: 'root'})
export class UsersService {
  private BASE_URL: string = 'http://localhost:8080/api/';
  postsList: Post[] = []
  postsChanged: Subject<Post[]> = new Subject<Post[]>();

  constructor(private http: HttpClient,
              private authService: AuthService,
              private friendService: FriendsService) {
  }

  getUserByIdHttp(id: number) {
    return this.http.get<User>(
      this.BASE_URL + 'users/' + id,
    )
  }

  getFollowingByHttp(userId: number) {
    return this.http.get<Followers[]>(
      this.BASE_URL + 'followers/' + userId
    )
  }

  getIsFollowingByHttp(userId: number, id: number) {
    return this.http.get<boolean>(
      this.BASE_URL + 'users/' + userId + '/' + id
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

  updatePosts() {
    this.postsChanged.next(this.postsList.slice());
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

    this.authService.user.subscribe(
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
  console.log(this.postsList)

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
    this.authService.user.subscribe(
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

  ngOnDestroy() {
  }


  setPosts(posts: Post[]) {
    this.postsList = posts;
    this.updatePosts();
  }

  unFollow(followerId: number) {
    this.authService.user.subscribe(
      user => {
        if (user) {
          this.http.post<any>(
            this.BASE_URL + "followers/remove/" + user.userId + "/" + followerId, {}
          ).subscribe(
            resData => {
              this.friendService.getFriendsByHttp(user.userId);
            }
          )
        }
      }
    )
  }

  followUser(userId: number) {
    this.authService.user.subscribe(
      user => {
        if (user) {
          this.http.post<any>(
            this.BASE_URL + "followers/add/" + user.userId + "/" + userId, {}
          ).subscribe(
            resData => {
              this.friendService.getFriendsByHttp(user.userId);
            }
          )
        }
      }
    )
  }
}
