import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit{

  LogInFrom: FormGroup = new FormGroup('');
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)
  fb : FormBuilder= inject(FormBuilder)

  ngOnInit(): void {
    this.LogInFrom = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit(){
    console.log(this.LogInFrom.value)
    this.authService.login();
    this.router.navigate(['']);
  }

  onRegister() {
    this.router.navigate(['./registration'])
  }
}
