import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";
import {User} from "../shared/user.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {matchPasswordValidator} from "../shared/matchpassword.validator";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  // user$ = new Observable<User | null>();

  user!: User;
  authService = inject(AuthService);
  category: string[] = ["FEIT", "FRI", "FBI"];
  fb = inject(FormBuilder);

  settingFrom: any;
  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPasswordRepeated: ['', [Validators.required, Validators.minLength(8)]],
  }, {validators: matchPasswordValidator()
  })

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user)
        this.user = user;
      this.settingFrom = this.fb.group({
        nickName: [this.user.nickName, [Validators.required]],
        firstName: [this.user.firstName, [Validators.required]],
        lastName: [this.user.lastName, [Validators.required]],
        email: [this.user.email, [Validators.required, Validators.email]],
        faculty: [this.user.faculty, [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
      })
    })

  }

  onSaveSettings() {
    console.log(this.settingFrom.value)
  }

  onSavePassword() {
    console.log(this.passwordForm)
  }
}
