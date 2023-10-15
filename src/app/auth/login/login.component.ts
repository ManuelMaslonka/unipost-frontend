import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../../shared/User.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  LogInFrom: FormGroup = new FormGroup('');
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)
  fb: FormBuilder = inject(FormBuilder)
  http: HttpClient = inject(HttpClient)

  ngOnInit(): void {
    this.LogInFrom = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit() {
    let email = this.LogInFrom.value.email;
    let password = this.LogInFrom.value.password;

    this.authService.logIn(email, password);
  }

  onRegister() {
    this.router.navigate(['./registration'])
  }
}
