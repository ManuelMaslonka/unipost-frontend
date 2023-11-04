import {Component, Input, OnDestroy} from '@angular/core';
import {Post} from "../../home/posts/post/post.model";
import {ProfileService} from "../profile.service";
import {Subscription} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.sass']
})
export class ProfilePostsComponent implements OnDestroy{

  @Input()
  post!: Post;

  isLiked: boolean = false;
  isCollapsed: boolean = true;
  profSub = new Subscription();
  isLikedSub = new Subscription();
  imageAuthor!: SafeUrl[];

  @Input()
  postId!: number;
  images: SafeUrl[] = [];
  selectedImage!: SafeUrl;

  constructor(private profileService: ProfileService,
              private modalService: NgbModal,
              private authService: AuthService
  ) {
  }
  ngOnInit(): void {
    this.isLikedSub = this.profileService.isLiked(this.post.postId, this.post).subscribe( isLiked => this. isLiked= isLiked);
    let images = this.profileService.getImageFromBackend(this.post.imagesId);
    if (images != undefined) {
      this.images = images;
    }
    this.imageAuthor = this.authService.getProfileImageUser(this.post.authorId);
  }

  open(content: any) {
    this.modalService.open(content, {size: 'xl', scrollable: true});
  }

  selectImage(image: SafeUrl) {
    this.selectedImage = image;
  }

  onLikeUp() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      console.log(this.post)
      this.profileService.likeDown(this.post.postId, this.post);
      return
    } else {
      this.profileService.likeUp(this.post.postId, this.post);
    }
  }

  ngOnDestroy(): void {
    this.profSub.unsubscribe();
    this.isLikedSub.unsubscribe();
  }



}
