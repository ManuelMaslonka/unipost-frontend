import {
    EventEmitter,
    Injectable
}                from "@angular/core";
import {Post}    from "./post/post.model";
import {Comment} from "./post/comment/comment.model";
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    postsChanged: Subject<Post[]> = new Subject<Post[]>();

    postsList: Post[] = [
        new Post("This is the first post in the history of this application", "Manuel", 5, 9, [new Comment("test", "Manuel Maslonka", 99, 0, true, "d"),
                                                                                               new Comment("test", "Manuel Maslonka", 99, 0, true, "d"),
                                                                                               new Comment("test", "Manuel Maslonka", 99, 0, true, "d")], false, ''),
        new Post("This is the first post in the history of this application", "Manuel", 5, 9, [], false, ''),
        new Post("This is the first post in the history of this application", "Manuel", 5, 9, [], false, '')
    ];

    addPosts(post: Post): void {
        this.postsList.unshift(post);
        this.postsChanged.next(this.postsList.slice());
    }

    liked(direction: boolean, id: number): void {
        if (direction) {
            this.addLikeUp(id);
        } else {
            this.addLikeDown(id);
        }
        this.postsList[id].liked = true;
    }

    addLikeUp(id: number): void {
        if (this.postsList[id].liked) {
            ++this.postsList[id].likesUp
            --this.postsList[id].likesDown
            this.postsList[id].direction = 'Like';
            return
        }
        ++this.postsList[id].likesUp
        this.postsList[id].direction = 'Like';
    }

    addLikeDown(id: number): void {
        if (this.postsList[id].liked) {
            --this.postsList[id].likesUp
            ++this.postsList[id].likesDown
            this.postsList[id].direction = 'Dislike';
            return
        }
        ++this.postsList[id].likesDown
        this.postsList[id].direction = 'Dislike';
    }

    likedComment(direction: boolean, postId: number, commentId: number): void {
        if (direction) {
            this.addLikeUpComment(postId, commentId);
        } else {
            this.addLikeDownComment(postId, commentId);
        }
        this.postsList[postId].comment[commentId].liked = true;
    }

    private addLikeUpComment(postId: number, commentId: number) {
        console.log(this.postsList[postId].direction)
        if (this.postsList[postId].comment[commentId].liked) {
            ++this.postsList[postId].comment[commentId].likesUp
            --this.postsList[postId].comment[commentId].likesDown
            this.postsList[postId].comment[commentId].direction = 'Like';

            return
        }
        ++this.postsList[postId].comment[commentId].likesUp
        this.postsList[postId].comment[commentId].direction = 'Like';
    }

    private addLikeDownComment(postId: number, commentId: number) {
        if (this.postsList[postId].comment[commentId].liked) {
            --this.postsList[postId].comment[commentId].likesUp
            ++this.postsList[postId].comment[commentId].likesDown
            this.postsList[postId].comment[commentId].direction = 'Dislike';
            return
        }
        ++this.postsList[postId].comment[commentId].likesDown
        this.postsList[postId].comment[commentId].direction = 'Dislike';
    }

    addComment(postId: number, comment: Comment) {
        this.postsList[postId].comment.unshift(comment);
        this.postsChanged.next(this.postsList.slice());
    }

    getComments(postId: number): Comment[] {
        return this.getPosts()[postId].comment.slice();
    }

    getPosts(): Post[] {
        return this.postsList.slice();
    }

}
