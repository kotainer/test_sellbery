import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors {
  if (!control.value) {
    return null;
  }

  return control.value.match(/[^a-zA-Zа-яА-Я0-9\-'_]/)
    ? null
    : {
        specialCharacter: 'Password must contain special character',
      };
}
