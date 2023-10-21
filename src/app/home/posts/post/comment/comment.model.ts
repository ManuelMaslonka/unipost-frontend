import {Post} from "../post.model";
import {User} from "../../../../shared/user.model";

export class Comment {

  constructor(
      public commentsId: number,
      public description: string,
      public post: Post,
      public createdDate: Date,
      public author: string,
      public likeCount: number,
      public like: any[],
      public postId?: number,
      public userId?: number
  ) {
  }

}
