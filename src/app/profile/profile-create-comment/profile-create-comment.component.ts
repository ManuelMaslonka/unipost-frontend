import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {User} from "../../shared/user.model";
import {AuthService} from "../../auth/auth.service";
import {Comment} from "../../home/posts/post/comment/comment.model";
import {ProfileService} from "../profile.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-profile-create-comment',
  templateUrl: './profile-create-comment.component.html',
  styleUrls: ['./profile-create-comment.component.sass']
})
export class ProfileCreateCommentComponent implements OnDestroy{
  @ViewChild('content')
  commentContent!: ElementRef;

  user!: User;
  @Input()
  postId: number = 0;

  userSub = new Subscription();

  constructor(private profileService: ProfileService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        if (user) {
          this.user = user;
        }
      }
    )
  }

  addCommentToPost(commentContent: string) {
    let post = this.profileService.getPostById(this.postId)
    if (post != undefined) {
      let comment = new Comment(0, commentContent, new Date(), this.user.firstName + " " + this.user.lastName, 1, [], this.postId, this.user.userId)
      this.profileService.addComment(comment, this.postId);
      this.commentContent.nativeElement.value = '';
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
