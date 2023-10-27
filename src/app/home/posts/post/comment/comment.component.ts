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
    index!: number;

    @Input()
    postId!: number;

    ngOnInit(): void {

    }

}
