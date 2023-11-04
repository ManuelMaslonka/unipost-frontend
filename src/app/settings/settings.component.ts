import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../shared/user.model";
import {FormBuilder, Validators} from "@angular/forms";
import {matchPasswordValidator} from "../shared/matchpassword.validator";
import {SettingsService} from "./settings.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  // user$ = new Observable<User | null>();

  user!: User;
  authService = inject(AuthService);
  settingService = inject(SettingsService);
  category: string[] = ["FEIT", "FRI", "FBI"];
  fb = inject(FormBuilder);
  router = inject(Router);

  settingFrom: any;
  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPasswordRepeated: ['', [Validators.required, Validators.minLength(8)]],
  }, {validators: matchPasswordValidator()
  })
  private selectedFile: File | null = null;
  private isSelectedFile: boolean = false;

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
        oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      })
    })

  }

  onSaveSettings() {
    this.settingService.updateUser(this.settingFrom);
  }

  onSavePassword() {
    this.settingService.updatePassword(this.passwordForm);
  }

  onDeleteAccount() {
    this.authService.deleteAccount();
    this.router.navigate(['/auth']);
  }

  onFileSelected($event: Event) {
    this.selectedFile = ($event.target as HTMLInputElement).files![0];
    this.isSelectedFile = true;
  }


  onChangeProfilePicture() {
    if (this.selectedFile != null) {
      let formData = new FormData();
      formData.append('profImage', this.selectedFile);
      this.settingService.changeProfilePicture(formData);
    }
    this.isSelectedFile = false;
    this.selectedFile = null;
  }
}
