import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './features/home/navbar/navbar.component';
import { FriendBarComponent } from './features/home/friend-bar/friend-bar.component';
import { MenuBarComponent } from './features/home/menu-bar/menu-bar.component';
import { FriendComponent } from './features/home/friend-bar/friend/friend.component';
import { NgOptimizedImage } from '@angular/common';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from './features/home/settings/settings.component';
import { ProfileComponent } from './features/home/profile/profile.component';
import { SearchComponent } from './features/home/search/search.component';
import { AuthComponent } from './features/auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './features/auth/auth-interceptor.service';
import { ProfilePostsComponent } from './features/home/profile/profile-posts/profile-posts.component';
import { UsersComponent } from './features/home/users/users.component';
import { UsersPostsComponent } from './features/home/users/users-posts/users-posts.component';
import { ProfileCreateCommentComponent } from './features/home/profile/profile-create-comment/profile-create-comment.component';
import { UsersCreateCommentsComponent } from './features/home/users/users-create-comments/users-create-comments.component';
import { SearchItemComponent } from './features/home/search/search-item/search-item.component';
import { AdminComponent } from './features/home/admin/admin.component';
import { UserTableComponent } from './features/home/admin/user-table/user-table.component';
import { PostsTableComponent } from './features/home/admin/posts-table/posts-table.component';
import { ProfileCommentsComponent } from './features/home/profile/profile-comments/profile-comments.component';
import { UsersCommentsComponent } from './features/home/users/users-comments/users-comments.component';
import { HomeComponent } from './features/home/home.component';
import { PostsComponent } from './features/home/posts/posts.component';
import { PostComponent } from './features/home/posts/post/post.component';
import { CreatePostComponent } from './features/home/posts/create-post/create-post.component';
import { CommentComponent } from './features/home/posts/post/comment/comment.component';
import { CreateCommentComponent } from './features/home/posts/post/create-comment/create-comment.component';

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
    SearchItemComponent,
    AdminComponent,
    UserTableComponent,
    PostsTableComponent,
    ProfileCommentsComponent,
    UsersCommentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    NgbModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
