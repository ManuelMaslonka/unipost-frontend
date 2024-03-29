import { Component, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../posts/post/post.model';

@Component({
  selector: 'app-users-posts',
  templateUrl: './users-posts.component.html',
  styleUrls: ['./users-posts.component.sass'],
})
export class UsersPostsComponent implements OnDestroy {
  @Input()
  post!: Post;

  isLiked: boolean = false;
  isCollapsed: boolean = true;

  @Input()
  postId!: number;
  images: SafeUrl[] = [];
  selectedImage!: SafeUrl;
  isLikedSub = new Subscription();
  imageAuthor!: SafeUrl[];
  indexOfSelectedImage: number = 0;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.isLikedSub = this.usersService
      .isLiked(this.post.postId, this.post)
      .subscribe((isLiked) => (this.isLiked = isLiked));
    let idsOfImages = this.post.imageInfo.map((image) => image.imageId);
    let images = this.usersService.getImageFromBackend(idsOfImages);
    if (images != undefined) {
      this.images = images;
    }
    this.imageAuthor = this.authService.getProfileImageUser(this.post.authorId);
  }

  onLikeUp() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      console.log(this.post);
      this.usersService.likeDown(this.post.postId, this.post);
      return;
    } else {
      this.usersService.likeUp(this.post.postId, this.post);
    }
  }

  open(content: any) {
    this.modalService.open(content, { size: 'xl', scrollable: true });
  }

  selectImage(image: SafeUrl, index: number) {
    this.selectedImage = image;
    this.indexOfSelectedImage = index;
  }

  ngOnDestroy(): void {
    this.isLikedSub.unsubscribe();
  }
}
