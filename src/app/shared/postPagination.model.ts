import {Post} from "../home/posts/post/post.model";

export class PostPagination {
  constructor(
    public totalItems: number,
    public post: Post[],
    public currentPage: number,
    public totalPages: number
  ) {
  }

}
