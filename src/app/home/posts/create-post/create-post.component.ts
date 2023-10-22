import {
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import {Post} from "../post/post.model";
import {PostsService} from "../posts.service";
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../../shared/user.model";

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.sass']
})
export class CreatePostComponent implements OnInit {

    @ViewChild('postContent')
    postContent!: ElementRef;
    user!: User;

    constructor(private postsService: PostsService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.user.subscribe(
            user => {
              if (user) {
                this.user = user
              }
            }
        )
    }

    onSavePostSend(content: string, isPrivate: string) {
        // todo create imagePath
        this.postsService.addPost(content, isPrivate, "123/123");
        this.postContent.nativeElement.value = '';
    }
}
