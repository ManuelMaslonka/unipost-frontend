import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { User } from '../../../../shared/user.model';
import { AuthService } from '../../../auth/auth.service';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';
import { Comment } from '../../posts/post/comment/comment.model';

@Component({
  selector: 'app-users-create-comments',
  templateUrl: './users-create-comments.component.html',
  styleUrls: ['./users-create-comments.component.sass'],
})
export class UsersCreateCommentsComponent implements OnDestroy {
  @ViewChild('content')
  commentContent!: ElementRef;

  user!: User;
  @Input()
  postId: number = 0;

  userSub = new Subscription();

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  addCommentToPost(commentContent: string) {
    let comment = new Comment(
      0,
      commentContent,
      new Date(),
      [],
      this.user.firstName + ' ' + this.user.lastName,
      0,
      this.postId,
      this.user.userId,
    );
    this.usersService.addComment(comment, this.postId, this.user.userId);
    this.commentContent.nativeElement.value = '';
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
