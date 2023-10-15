import {Post} from "../home/posts/post/post.model";

export class User {

  constructor(private userId: number,
              private nickName: string,
              private firstName: string,
              private lastName: string,
              private email: string,
              private createdDated: string,
              private country: string,
              private gender: string,
              private faculty: string,
              private imageUrl: string,
              private posts: Post[],
              private likes: number,
              private comments: Comment,
              private followers: number,) {
  }

}
