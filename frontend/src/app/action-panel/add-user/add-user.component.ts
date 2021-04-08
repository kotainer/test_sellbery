import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DUPLICATE_STATUS } from 'src/app/const/status-codes';
import { ApiService } from 'src/app/services/api.service';
import { RefreshService } from 'src/app/services/refresh.service';
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

  constructor(
    public readonly dialogRef: MatDialogRef<AddUserComponent>,
    private readonly apiService: ApiService,
    private readonly refreshService: RefreshService
  ) {}

  public close() {
    this.dialogRef.close();
  }

  public save() {
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    this.apiService.addUser(this.form.value).subscribe({
      next: () => {
        this.refreshService.hasChangesSubject$.next();
        this.close();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === DUPLICATE_STATUS) {
          this.form.get('email').setErrors({
            duplicate: true
          })
        }
      },
    });
  }
}
