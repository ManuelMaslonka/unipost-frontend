import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  genders: string[] = ['Male', 'Female', 'other'];

  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  selectedFiles!: File | null;
  isError: boolean = false;
  errorMessages: string = '';

  registerForm = this.fb.group({
    nickName: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.min(8)]],
    email: ['', [Validators.required, Validators.email]],
    country: ['', [Validators.required]],
    faculty: ['', [Validators.required]],
    gender: ['', [Validators.required]]

  })

  ngOnInit() {

  }

  get nickName() {
    return this.registerForm.get('nickName')
  }

  get firstName() {
    return this.registerForm.get('firstName')
  }

  get lastName() {
    return this.registerForm.get('lastName')
  }

  get password() {
    return this.registerForm.get('password')
  }

  get email() {
    return this.registerForm.get('email')
  }

  get country() {
    return this.registerForm.get('country')
  }

  get faculty() {
    return this.registerForm.get('faculty')
  }

  get gender() {
    return this.registerForm.get('gender')
  }


  onRegister() {


    if (this.selectedFiles != null) {
      const formData = new FormData();
      formData.append("profImage", this.selectedFiles)
    } else {
      this.selectedFiles = null;
    }

    this.authService.register(this.registerForm, this.selectedFiles).subscribe({
        next: () => {
          this.selectedFiles = null;
          this.registerForm.reset();
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.isError = true;
          this.errorMessages = err;
        }
      }
    );



  }

  onReset() {
    this.registerForm.reset();
  }

  onFileSelected($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files![0];
    console.log(this.selectedFiles)
  }

  onCloseError() {
    this.isError = false;
    this.errorMessages = '';
  }


}
