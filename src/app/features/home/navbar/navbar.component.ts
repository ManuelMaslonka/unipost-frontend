import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../shared/user.model';
import { Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userSubscription: Subscription = new Subscription();
  user?: User;
  imageSrc!: SafeUrl[];
  isAdministrator: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe((user) => {
      if (user != null) {
        this.user = user;
        this.imageSrc = this.authService.getProfileImageLoggedUser();
        if (this.user.role == 'ADMIN') {
          this.isAdministrator = true;
        }
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
