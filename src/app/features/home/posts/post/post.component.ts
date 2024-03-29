import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from '../posts.service';
import { SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.sass'],
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post!: Post;
  isLiked: boolean = false;
  isCollapsed: boolean = true;
  images!: SafeUrl[];
  selectedImage!: SafeUrl;
  authorImage!: SafeUrl[];
  isEditable: boolean = false;
  indexOfSelectedImage: number = 0;
  postSubs!: Subscription;
  userSubs!: Subscription;
  userSubs1!: Subscription;

  @Input() postId!: number;

  constructor(
    private postsService: PostsService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.postSubs = this.postsService
      .isLiked(this.post.postId, this.post)
      .subscribe((isLiked) => {
        this.isLiked = isLiked;
      });

    let idsOfImages = this.post.imageInfo.map((image) => image.imageId);
    let images = this.postsService.getImageFromBackend(idsOfImages);
    if (images != undefined) {
      this.images = images;
    }
    this.authorImage = this.authService.getProfileImageUser(this.post.authorId);
    this.userSubs1 = this.authService.user.subscribe((user) => {
      if (user) {
        this.isEditable = user.userId == this.post.authorId;
      }
    });
  }

  onLikeUp() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      this.postsService.likeDown(this.post.postId, this.post);
      return;
    } else {
      this.postsService.likeUp(this.post.postId, this.post);
    }
  }

  open(content: any) {
    this.modalService.open(content, { size: 'xl', scrollable: true });
  }

  selectImage(image: SafeUrl, index: number) {
    this.selectedImage = image;
    this.indexOfSelectedImage = index;
  }

  onDelete() {
    this.postsService.deletePost(this.post.postId);
  }

  onGoProfile() {
    this.userSubs = this.authService.user.subscribe((user) => {
      if (user) {
        if (user.userId == this.post.authorId) {
          this.router.navigate(['/profile']);
        } else {
          this.router.navigate(['/users', this.post.authorId]);
        }
      }
    });
  }
}
