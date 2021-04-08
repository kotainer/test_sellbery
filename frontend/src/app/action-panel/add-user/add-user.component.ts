import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { passwordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.less'],
})
export class AddUserComponent {
  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      passwordValidator,
    ]),
  });

  public matcher = new ErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<AddUserComponent>) {}

  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.form.value);
  }
}
