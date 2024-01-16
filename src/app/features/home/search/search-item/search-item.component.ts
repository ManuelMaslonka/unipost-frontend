import { Component, inject, Input, OnInit } from '@angular/core';
import { User } from '../../../../shared/user.model';
import { SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.sass'],
})
export class SearchItemComponent implements OnInit {
  @Input()
  user!: User;

  images: SafeUrl[] = [];
  authService = inject(AuthService);

  ngOnInit(): void {
    this.images = this.authService.getProfileImageUser(this.user.userId);
  }
}
