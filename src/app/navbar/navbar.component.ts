import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {User} from "../shared/user.model";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, OnDestroy{

    userSubscription: Subscription = new Subscription();
    user?: User;
    // todo image source create
    imageSrc: string = "assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg";


    constructor(private route: ActivatedRoute,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.userSubscription = this.authService.user.subscribe(
            user => {
              if (user != null) {
                this.user = user;
              }
            }
        )
    }

    onLogout() {
      this.authService.logout();
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }

}
