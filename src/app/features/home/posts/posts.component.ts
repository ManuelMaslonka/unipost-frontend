import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post/post.model';
import { PostsService } from './posts.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass'],
})
export class PostsComponent implements OnInit, OnDestroy {
  posts$: Observable<Post[]> = new Observable<Post[]>();

  postSubs: Subscription = new Subscription();
  pageSubs: Subscription = new Subscription();
  postsService: PostsService = inject(PostsService);
  page: number = 0;
  pageMax: number = 0;
  isShowFollowed: boolean = false;

  ngOnInit() {
    this.postsService.getPostByHttpPagination(0);
    this.posts$ = this.postsService.postsChanged;
    this.pageSubs = this.postsService.pageMax.subscribe((pageMax) => {
      this.pageMax = pageMax;
    });
  }

  ngOnDestroy() {
    this.postSubs.unsubscribe();
    this.pageSubs.unsubscribe();
  }

  addPosts() {
    this.page++;
    this.postsService.getPostByHttpPagination(this.page);
  }

  onShowFollowedPosts() {
    this.isShowFollowed = true;
    this.postsService.getFollowedPostsFromBackend();
    this.posts$ = this.postsService.postsChanged;
  }

  onShowAllPosts() {
    this.isShowFollowed = false;
    this.postsService.getPostByHttpPagination(0);
    this.posts$ = this.postsService.postsChanged;
  }
}
