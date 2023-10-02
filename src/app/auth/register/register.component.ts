import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit{
  genders: string[] = ['Male', 'Female', 'other'];

  fb = inject(FormBuilder);

  form = this.fb.group({
    nickName: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    email: ['', [Validators.required]],
    country: ['', [Validators.required]],
    faculty: ['', [Validators.required]],
    gender: ['', [Validators.required]]

  })

  ngOnInit() {

  }

  get nickName(){
    return this.form.get('nickName')
  }

  get firstName(){
    return this.form.get('firstName')
  }

  get lastName() {
    return this.form.get('lastName')
  }

  get password() {
    return this.form.get('password')
  }

  get email() {
    return this.form.get('email')
  }

  get country() {
    return this.form.get('country')
  }

  get faculty() {
    return this.form.get('faculty')
  }

  get gender() {
    return this.form.get('gender')
  }


  onRegister() {
    console.log(this.form)
  }
}
