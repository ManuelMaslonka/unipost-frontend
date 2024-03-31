import { Followers } from './followers.model';
import { Post } from '../features/home/posts/post/post.model';
import { Comment } from '../features/home/posts/post/comment/comment.model';

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
    public faculty: string,
    public posts: Post[],
    public like: [],
    public imageUrl: string,
    public comments: Comment[],
    public followers: Followers[],
    public darkTheme: boolean,
    public role: String,
    public _token: string,
    public _refreshToken: string,
    public _tokenExpirationTime: string,
    public _refreshTokenExpirationTime: string,
  ) {}
}
