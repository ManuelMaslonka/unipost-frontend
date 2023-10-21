import {Comment} from "./comment/comment.model";
import {Like} from "../../../shared/like.model";

export class Post {
  constructor(
      public postId: number,
      public postName: string,
      public description: string,
      public likeCount: number,
      public createdDate: Date,
      public postImageUrl: string,
      public likes: Like[],
      public comments: Comment[],
      public isPrivate: boolean,
      public author: string,
  ) {
  }

}
