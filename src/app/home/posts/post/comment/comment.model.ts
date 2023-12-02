import { LikeComment } from './likeComment.inferface';

export class Comment {
  constructor(
    public commentId: number,
    public description: string,
    public createdDate: Date,
    public likeComments: LikeComment[],
    public author: string,
    public likeCount: number,
    public postId: number,
    public userId: number,
  ) {}
}
