import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.less'],
})
export class ActionPanelComponent {
  constructor(private readonly dialog: MatDialog) {}

  public openAddDialog() {
    this.dialog.open(AddUserComponent, {
      width: '300px',
    });
  }
}
