import {
  Component,
  inject,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit{

  LogInFrom: FormGroup = new FormGroup('');
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)

  ngOnInit(): void {
    this.LogInFrom = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    })
  }

  onSubmit(){
    console.log(this.LogInFrom.value)
    this.authService.login();
    this.router.navigate(['']);
  }

}
