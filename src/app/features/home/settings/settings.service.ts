import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FormGroup} from "@angular/forms";


@Injectable({providedIn: "root"})
export class SettingsService {

  private baseUrl: string = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {
  }

  updateUser(settingFrom: FormGroup) {
    this.http.post(
      this.baseUrl + 'users/update', {
        "nickName": settingFrom.value.nickName,
        "firstName": settingFrom.value.firstName,
        "lastName": settingFrom.value.lastName,
        "email": settingFrom.value.email,
        "faculty": settingFrom.value.faculty,
        "oldPassword": settingFrom.value.oldPassword
      }
    ).subscribe(resData => console.log(resData))
  }

  updatePassword(passwordForm: FormGroup) {

    this.http.post(
      this.baseUrl + 'users/update/password', {
        "oldPassword": passwordForm.value.oldPassword,
        "newPassword": passwordForm.value.newPassword,
        "newPasswordRepeated": passwordForm.value.newPasswordRepeated
      }
    ).subscribe(resData => {
      console.log(resData)
    })
  }


  changeProfilePicture(formData: FormData) {
    this.http.post(
      this.baseUrl + 'users/update/profilePicture', formData
    ).subscribe(resData => {
      console.log(resData)
    })

  }


}
