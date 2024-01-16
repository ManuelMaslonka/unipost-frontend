import { Comment } from './comment/comment.model';
import { Like } from '../../../../shared/like.model';
import { User } from '../../../../shared/user.model';
export class Post {
  constructor(
    public postId: number,
    public description: string,
    public likeCount: number,
    public createdDate: Date,
    public imageInfo: ImageInfo[],
    public likes: Like[],
    public comments: Comment[],
    public isPrivate: boolean,
    public author: string | User,
    public authorId: number,
  ) {}
}

export interface ImageInfo {
  imageId: number;
  imageType: string;
}
