import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { passwordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.less'],
})
export class UpdateUserDialogComponent {
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

  constructor(
    public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly user: User
  ) {
    this.form.patchValue(user);
  }

  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close({
      _id: this.user._id,
      ...this.form.value,
    });
  }
}
