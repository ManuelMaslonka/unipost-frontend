import {Component, OnInit} from '@angular/core';
import {User} from "../shared/user.model";
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "./users.service";
import {AuthService} from "../auth/auth.service";
import {Post} from "../home/posts/post/post.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit{

  user!: User;
  posts: Post[] = [];
  imageSrc: string = "assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg";
  following: number = 0;
  isFollowing: boolean = false;

  constructor(private route: ActivatedRoute,
              private usersService: UsersService,
              private authService: AuthService) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.usersService.getUserByIdHttp(params['id']).subscribe(
          user => {
            this.user = user;
            this.usersService.getUserPostByHttp(user.userId).subscribe()
            this.usersService.getFollowingByHttp(user.userId).subscribe(
              following => {
                this.following = following.length;
              }
            )
            this.authService.user.subscribe(
              loginUser  => {
                if (loginUser) {
                  this.usersService.getIsFollowingByHttp(loginUser.userId ,user.userId).subscribe(
                    isFollowing => {
                      this.isFollowing = isFollowing;
                    }
                  )
                }
              }
            )
          }
        )
      }
    )
      this.usersService.postsChanged.subscribe(
          posts => {
              this.posts = posts;
          }
      )
  }

  switchFollow() {

  }
}
