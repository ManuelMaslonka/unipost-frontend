import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {SettingsComponent} from "./settings/settings.component";
import {ProfileComponent} from "./profile/profile.component";
import {SearchComponent} from "./search/search.component";
import {AuthComponent} from "./auth/auth.component";
import {PostsComponent} from "./home/posts/posts.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {authGuard} from "./auth/auth-guard";
import {UsersComponent} from "./users/users.component";
import {AdminComponent} from "./admin/admin.component";
import {UserTableComponent} from "./admin/user-table/user-table.component";
import {PostsTableComponent} from "./admin/posts-table/posts-table.component";
import {adminGuard} from "./admin/admin-guard";

const routes: Routes = [
  {
    path: 'auth',
    redirectTo: 'auth/login'
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'registration', component: RegisterComponent}
    ]
  },
  {
    path: '', component: HomeComponent, canActivate: [authGuard],children: [
      {path: 'posts', component: PostsComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'profile', component: ProfileComponent},
      {path: "search", component: SearchComponent},
      {path: "users/:id", component: UsersComponent},
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [adminGuard],children: [
      {path: 'users', component: UserTableComponent},
      {path: 'posts', component: PostsTableComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
