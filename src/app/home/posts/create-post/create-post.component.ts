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
                this.user = user
            }
        )
    }

    onSavePostSend(content: string) {
        console.log(this.user.firstName)
        this.postContent.nativeElement.value = '';
        const post: Post = new Post(3, "test", "test", 1, new Date(), "asdasd/asdsa", [], [], false, this.user?.firstName + this.user?.lastName);
        this.postsService.addPost(post);
    }
}
