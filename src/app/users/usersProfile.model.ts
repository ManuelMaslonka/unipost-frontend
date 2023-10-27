import {Post} from "../home/posts/post/post.model";
import {Comment} from "../home/posts/post/comment/comment.model";
import {Followers} from "../shared/followers.model";

export class UsersProfile {

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
    public followers: Followers[],
  public followed: boolean
  ) {
  }

}
