import {
    Component,
    inject,
    Input, OnInit
} from '@angular/core';
import {Comment} from "./comment.model";
import {PostsService} from "../../posts.service";

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.sass']
})
export class CommentComponent implements OnInit {

    @Input()
    comment!: Comment;

    @Input()
    commentId!: number;

    @Input()
    postId!: number;

    isLiked: boolean = false;
    isClicked: boolean = false

    postsService: PostsService = inject(PostsService)

    ngOnInit(): void {
    }


    onLikeUp() {
        if (!this.isLiked) {
            this.isLiked = true
            this.postsService.commentLikeUp(this.postId, this.commentId);
        } else {
            this.postsService.commentLikeDown(this.postId, this.commentId);
            this.isLiked = false
        }
    }
}
