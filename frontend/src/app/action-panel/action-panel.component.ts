import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { RefreshService } from '../services/refresh.service';
import { AddUserComponent } from './add-user/add-user.component';

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.less'],
})
export class ActionPanelComponent {
  constructor(
    private readonly dialog: MatDialog,
    private readonly apiService: ApiService,
    private readonly refreshService: RefreshService
  ) {}

  public openAddDialog() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '300px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap((user: User) => this.apiService.addUser(user))
      )
      .subscribe({
        next: () => this.refreshService.hasChangesSubject$.next(),
      });
  }
}
