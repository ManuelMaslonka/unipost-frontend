import {Comment} from "./comment/comment.model";

export class Post {
  constructor(public content: string, public author: string, public likesUp: number, public likesDown: number, public comment: Comment[],public liked: boolean, public direction: string) {
  }
}
