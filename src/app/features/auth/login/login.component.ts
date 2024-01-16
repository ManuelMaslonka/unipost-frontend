import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit, OnDestroy {
  LogInFrom: FormGroup = new FormGroup('');
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  http: HttpClient = inject(HttpClient);
  isError: boolean = false;
  errorMessages: string = '';

  // Subscription here
  loginSub: Subscription = new Subscription();

  ngOnInit(): void {
    this.LogInFrom = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    let email = this.LogInFrom.value.email;
    let password = this.LogInFrom.value.password;

    this.loginSub = this.authService.logIn(email, password).subscribe({
      next: () => {},
      error: (err) => {
        this.isError = true;
        this.errorMessages = err;
      },
    });
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  }

  onClose() {
    this.isError = false;
  }
}
