import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { User } from '../../../../shared/user.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.sass'],
})
export class CreatePostComponent implements OnInit {
  @ViewChild('postContent')
  postContent!: ElementRef;
  user!: User;
  errorMessages: string = '';
  error: boolean = false;
  userSub = new Subscription();
  selectedFiles!: FileList | null;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onFileSelected($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
  }

  onUpload(content: string) {
    if (content === '') {
      this.error = true;
      this.errorMessages = 'Content is required!';
      return;
    }

    if (this.selectedFiles != null) {
      const formData = new FormData();
      Array.from(this.selectedFiles).forEach((file) => {
        formData.append('files', file);
      });
      this.postsService.addPost(content, formData);
    } else {
      this.postsService.addPost(content, new FormData());
    }
    this.postContent.nativeElement.value = '';
    this.selectedFiles = null;
  }
}
