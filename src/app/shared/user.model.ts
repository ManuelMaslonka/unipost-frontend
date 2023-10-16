import {Post} from "../home/posts/post/post.model";
import {Comment} from "../home/posts/post/comment/comment.model";

export class User {

  constructor(
    public userId: number,
    public nickName: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public createdDated: Date,
    public country: string,
    public gender: string,
    public posts: Post[],
    public like: [],
    public imageUrl: string,
    public comments: Comment[],
    public follower: unknown,
    public role: String
  ) {
  }


}
