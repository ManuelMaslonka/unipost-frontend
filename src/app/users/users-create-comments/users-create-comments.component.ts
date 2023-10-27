import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {User} from "../../shared/user.model";
import {ProfileService} from "../../profile/profile.service";
import {AuthService} from "../../auth/auth.service";
import {Comment} from "../../home/posts/post/comment/comment.model";
import {UsersService} from "../users.service";

@Component({
    selector: 'app-users-create-comments',
    templateUrl: './users-create-comments.component.html',
    styleUrls: ['./users-create-comments.component.sass']
})
export class UsersCreateCommentsComponent {

    @ViewChild('content')
    commentContent!: ElementRef;

    user!: User;
    @Input()
    postId: number = 0;

    constructor(private usersService: UsersService,
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
        console.log('addCommentToPost')
        console.log('addCommentToPost')
        let comment = new Comment(0,
            commentContent,
            new Date(),
            this.user.firstName + " " + this.user.lastName,
            1,
            [],
            this.postId,
            this.user.userId)
        this.usersService.addComment(comment, this.postId);
        this.commentContent.nativeElement.value = '';

    }
}