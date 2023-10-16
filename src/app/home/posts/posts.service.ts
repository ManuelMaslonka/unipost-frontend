import {Injectable, OnInit} from "@angular/core";
import {Post} from "./post/post.model";
import {Comment} from "./post/comment/comment.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../shared/user.model";

@Injectable({
    providedIn: 'root'
})
export class PostsService implements OnInit {

    private baseUrl: string = 'http://localhost:8080/';
    user!: User;
    postsChanged: Subject<Post[]> = new Subject<Post[]>();

    postsList: Post[] = [
        // new Post(12, "sadasd", "asdsa", 12, new Date(), "asda/asddsa", [], [], false, "Manuel Maslonka")
    ];

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    ngOnInit(): void {

    }

    addPost(post: Post) {
        this.postsList.unshift(post)
        this.updatePosts();
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
            this.baseUrl + "posts"
        ).subscribe(resData => {
            this.postsList = resData;
            this.updatePosts();
        })
    }

    likeUp(postId: number) {
        this.postsList[postId].likeCount++;
    }

    likeDown(postId: number) {
        this.postsList[postId].likeCount--;
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
}
