import {NgModule}          from '@angular/core';
import {
  RouterModule,
  Routes
}                          from '@angular/router';
import {HomeComponent}     from "./home/home.component";
import {SettingsComponent} from "./settings/settings.component";
import {ProfileComponent}  from "./profile/profile.component";
import {SearchComponent}   from "./search/search.component";
import {authGuard}         from "./auth/auth-guard";
import {AuthComponent}     from "./auth/auth.component";
import {PostsComponent}    from "./home/posts/posts.component";

const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {
    path: '', component: HomeComponent, canActivate: [],children: [
      {path: 'posts', component: PostsComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'profile', component: ProfileComponent},
      {path: "search", component: SearchComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
