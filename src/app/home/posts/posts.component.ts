import {
  Component,
  OnInit
}                     from '@angular/core';
import {Post}         from "./post/post.model";
import {PostsService} from "./posts.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass']
})
export class PostsComponent implements OnInit {

  posts: Post[] = [];

  constructor(private postsService: PostsService) {
  }

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.postsService.postsChanged.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    )
  }

}
