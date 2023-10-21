import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PostsService} from "../../posts.service";
import {Comment} from "../comment/comment.model";
import {User} from "../../../../shared/user.model";
import {AuthService} from "../../../../auth/auth.service";

@Component({
    selector: 'app-create-comment',
    templateUrl: './create-comment.component.html',
    styleUrls: ['./create-comment.component.sass']
})
export class CreateCommentComponent implements OnInit {

    @ViewChild('content')
    commentContent!: ElementRef;

    user!: User;
    @Input()
    postId: number = 0;

    constructor(private postsService: PostsService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.user.subscribe(
          user => {
            if (user) {
              this.user = user;
            }
          }
        )
    }

    addCommentToPost(commentContent: string) {

        let comment = new Comment(12, commentContent, this.postsService.getPostById(this.postId), new Date(), this.user.firstName + " " + this.user.lastName, 1, [], this.postId, this.user.userId)
        this.postsService.addComment(this.postId, comment);
        this.commentContent.nativeElement.value = '';
    }


}



