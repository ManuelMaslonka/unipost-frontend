import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
}                     from '@angular/core';
import {Post}         from "../post/post.model";
import {PostsService} from "../posts.service";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.sass']
})
export class CreatePostComponent implements OnInit {

  @ViewChild('postContent')
  postContent!: ElementRef;

  constructor(private postsService: PostsService) {
  }

  ngOnInit() {

  }

  onSavePostSend(content: string) {
    this.postContent.nativeElement.value = '';
    const post: Post = new Post(content, "Manuel Maslonka", 0, 0, [], false, '');
    this.postsService.addPosts(post);
  }
}
