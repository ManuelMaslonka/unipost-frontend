import {
  Component,
  inject,
  Input, OnDestroy, OnInit
} from '@angular/core';
import {Post}         from "./post.model";
import {PostsService} from "../posts.service";
import {AuthService} from "../../../auth/auth.service";
import {first, interval, observable, Observable, of, Subscription} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.sass']
})
export class PostComponent implements OnInit, OnDestroy{

  @Input()
  post!: Post;
  isLiked: boolean = false;
  isCollapsed: boolean = true;
  images!: SafeUrl[];
  selectedImage!: SafeUrl;

  @Input()
  postId!: number;


  constructor(private postsService: PostsService,
              private modalService: NgbModal
            ) {
  }


  ngOnInit(): void {
    this.postsService.isLiked(this.post.postId, this.post).subscribe(
      (isLiked) => {
        this.isLiked = isLiked;
      }
    );
    let images = this.postsService.getImageFromBackend(this.post.imagesId);
    if (images != undefined) {
      this.images = images;
      console.log(this.images)
    }
  }


  onLikeUp() {
    this.isLiked = !this.isLiked;
    if (!this.isLiked) {
      console.log(this.post)
      this.postsService.likeDown(this.post.postId, this.post);
      return
    } else {
      this.postsService.likeUp(this.post.postId, this.post);
    }
  }

  ngOnDestroy(): void {
  }

  open(content: any) {
    this.modalService.open(content, {size: 'xl', scrollable: true});
  }

  selectImage(image: SafeUrl) {
    this.selectedImage = image;
  }

}
