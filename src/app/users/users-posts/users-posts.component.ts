import {Component, Input, OnDestroy} from '@angular/core';
import {Post} from "../../home/posts/post/post.model";
import {ProfileService} from "../../profile/profile.service";
import {AuthService} from "../../auth/auth.service";
import {UsersService} from "../users.service";
import {Observable, of, Subscription} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-users-posts',
  templateUrl: './users-posts.component.html',
  styleUrls: ['./users-posts.component.sass']
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

  constructor(private usersService: UsersService,
              private authService: AuthService,
              private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.isLikedSub =
      this.usersService.isLiked(this.post.postId, this.post).subscribe(isLiked => this.isLiked = isLiked)
    let images = this.usersService.getImageFromBackend(this.post.imagesId);
    if (images != undefined) {
      this.images = images;
    }
  }

  onLikeUp() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      console.log(this.post)
      this.usersService.likeDown(this.post.postId, this.post);
      return
    } else {
      this.usersService.likeUp(this.post.postId, this.post);
    }
  }

  open(content: any) {
    this.modalService.open(content, {size: 'xl', scrollable: true});
  }

  selectImage(image: SafeUrl) {
    this.selectedImage = image;
  }


  ngOnDestroy(): void {
    this.isLikedSub.unsubscribe();
  }

}
