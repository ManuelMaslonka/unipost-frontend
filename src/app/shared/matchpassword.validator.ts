import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export function matchPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value.newPassword === control.value.newPasswordRepeated
      ? null
      : { PasswordNoMatch: true };
  }
}
