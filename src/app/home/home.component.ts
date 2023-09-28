import {
  Component,
  inject,
  OnInit
} from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit{

  authService: AuthService = inject(AuthService)

  isAuthenticate: boolean = false;

  ngOnInit(): void {

  }




}
