import {
  Component,
  inject,
  OnDestroy,
  OnInit
}                     from '@angular/core';
import {Post}         from "./post/post.model";
import {PostsService} from "./posts.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass']
})
export class PostsComponent implements OnInit, OnDestroy {

  posts: Post[] = [];

  subscription: Subscription = new Subscription();
  postsService: PostsService = inject(PostsService)


  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.subscription = this.postsService.postsChanged.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    )
    this.postsService.getPostByHttp();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
