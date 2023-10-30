import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule}       from './app-routing.module';
import {AppComponent}           from './app.component';
import {HomeComponent}          from './home/home.component';
import {NavbarComponent}        from './navbar/navbar.component';
import {FriendBarComponent}     from './friend-bar/friend-bar.component';
import {MenuBarComponent}       from './menu-bar/menu-bar.component';
import {FriendComponent}        from './friend-bar/friend/friend.component';
import {PostsComponent}         from './home/posts/posts.component';
import {PostComponent}          from './home/posts/post/post.component';
import {CreatePostComponent}    from './home/posts/create-post/create-post.component';
import {NgOptimizedImage}       from "@angular/common";
import {
  NgbCollapseModule,
  NgbModule
}                               from '@ng-bootstrap/ng-bootstrap';
import {CommentComponent}       from './home/posts/post/comment/comment.component';
import {CreateCommentComponent} from './home/posts/post/create-comment/create-comment.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { AuthComponent } from './auth/auth.component';
import {ReactiveFormsModule}    from "@angular/forms";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import { ProfilePostsComponent } from './profile/profile-posts/profile-posts.component';
import { UsersComponent } from './users/users.component';
import { UsersPostsComponent } from './users/users-posts/users-posts.component';
import { ProfileCreateCommentComponent } from './profile/profile-create-comment/profile-create-comment.component';
import { UsersCreateCommentsComponent } from './users/users-create-comments/users-create-comments.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FriendBarComponent,
    MenuBarComponent,
    FriendComponent,
    PostsComponent,
    PostComponent,
    CreatePostComponent,
    CommentComponent,
    CreateCommentComponent,
    SettingsComponent,
    ProfileComponent,
    SearchComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ProfilePostsComponent,
    UsersComponent,
    UsersPostsComponent,
    ProfileCreateCommentComponent,
    UsersCreateCommentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    NgbModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
