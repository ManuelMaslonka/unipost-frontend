import {
  Component,
  ElementRef,
  Input,
  ViewChild
}                     from '@angular/core';
import {PostsService} from "../../posts.service";
import {Comment}      from "../comment/comment.model";

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.sass']
})
export class CreateCommentComponent {

  @ViewChild('content')
  content!: ElementRef;

  @Input()
  postId: number = 0;

  constructor(private postsService: PostsService) {
  }

  addCommentToPost(content: string): void {
    this.content.nativeElement.value = '';
    let comment: Comment = new Comment(content, "Manuel Maslonka", 0 , 0, false, '')
    this.postsService.addComment(this.postId, comment)
  }

}
