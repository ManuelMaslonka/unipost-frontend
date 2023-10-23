import {
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import {Post} from "./post/post.model";
import {PostsService} from "./posts.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass']
})
export class PostsComponent implements OnInit, OnDestroy {

  posts: Post[] = [];

  postSubs: Subscription = new Subscription();
  pageSubs: Subscription = new Subscription();
  postsService: PostsService = inject(PostsService);
  page: number = 0;
  pageMax: number = 0;


  ngOnInit() {
    this.postsService.getPostByHttpPagination(0);
    this.postSubs = this.postsService.postsChanged.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    )
    this.pageSubs = this.postsService.pageMax.subscribe(
      pageMax => {
        this.pageMax = pageMax;
      }
    )
  }

  ngOnDestroy() {
    this.postSubs.unsubscribe();
    this.pageSubs.unsubscribe();
  }

  addPosts() {
    this.page++;
    this.postsService.getPostByHttpPagination(this.page);
  }


}
