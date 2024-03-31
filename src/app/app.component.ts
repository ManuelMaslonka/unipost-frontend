import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from './features/auth/auth.service';
import { ThemeService } from './theme.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  theme = 'light';
  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.user.subscribe((user) => {
      if (user) {
        this.themeService.isDark.next(user.darkTheme);
      }
    });
    this.themeService.isDark.subscribe((isDark: boolean) => {
      this.theme = isDark ? 'dark' : 'light';
      if (isDark) {
        this.renderer.removeClass(this.document.body, 'light-body');
        this.renderer.addClass(this.document.body, 'dark-body');
      } else {
        this.renderer.removeClass(this.document.body, 'dark-body');
        this.renderer.addClass(this.document.body, 'light-body');
      }
    });
  }
}
