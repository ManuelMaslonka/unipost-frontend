import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './features/home/settings/settings.component';
import { ProfileComponent } from './features/home/profile/profile.component';
import { SearchComponent } from './features/home/search/search.component';
import { AuthComponent } from './features/auth/auth.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './features/auth/auth-guard';
import { UsersComponent } from './features/home/users/users.component';
import { AdminComponent } from './features/home/admin/admin.component';
import { UserTableComponent } from './features/home/admin/user-table/user-table.component';
import { PostsTableComponent } from './features/home/admin/posts-table/posts-table.component';
import { adminGuard } from './features/home/admin/admin-guard';
import { HomeComponent } from './features/home/home.component';
import { PostsComponent } from './features/home/posts/posts.component';

const routes: Routes = [
  {
    path: 'auth',
    redirectTo: 'auth/login',
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'posts', component: PostsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'search', component: SearchComponent },
      { path: 'users/:id', component: UsersComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'users', component: UserTableComponent },
      { path: 'posts', component: PostsTableComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
