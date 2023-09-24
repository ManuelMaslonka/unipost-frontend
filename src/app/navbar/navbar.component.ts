import {Component} from '@angular/core';
import {
  ActivatedRoute,
  Data
}                  from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  userName: string = "Manuel";
  imageSrc: string = "assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg";


  constructor(private route: ActivatedRoute) {

  }

}
