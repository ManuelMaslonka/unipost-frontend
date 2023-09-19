import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule}    from './app-routing.module';
import {AppComponent}        from './app.component';
import {HomeComponent}       from './home/home.component';
import {NavbarComponent}     from './navbar/navbar.component';
import {FriendBarComponent}  from './friend-bar/friend-bar.component';
import {MenuBarComponent}    from './menu-bar/menu-bar.component';
import {FriendComponent}     from './friend-bar/friend/friend.component';
import {MenuItemComponent}   from './menu-bar/menu-item/menu-item.component';
import {PostsComponent}      from './home/posts/posts.component';
import {PostComponent}       from './home/posts/post/post.component';
import {CreatePostComponent} from './home/posts/create-post/create-post.component';
import {NgOptimizedImage}    from "@angular/common";
import {
  NgbCollapseModule,
  NgbModule
}                            from '@ng-bootstrap/ng-bootstrap';
import {CommentComponent}    from './home/posts/post/comment/comment.component';
import { CreateCommentComponent } from './home/posts/post/create-comment/create-comment.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FriendBarComponent,
    MenuBarComponent,
    FriendComponent,
    MenuItemComponent,
    PostsComponent,
    PostComponent,
    CreatePostComponent,
    CommentComponent,
    CreateCommentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    NgbModule,
    NgbCollapseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
