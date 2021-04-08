import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { RefreshService } from '../services/refresh.service';
import { UpdateUserDialogComponent } from './update-user-dialog/update-user-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less'],
})
export class UsersListComponent implements AfterViewInit {
  public displayedColumns: string[] = ['name', 'email', 'actions'];
  public filteredAndPagedIssues: Observable<User[]> = new Observable();

  public resultsLength = 0;
  public isLoadingResults = true;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  constructor(
    private readonly dialog: MatDialog,
    private readonly apiService: ApiService,
    private readonly refreshService: RefreshService
  ) {}

  public ngAfterViewInit() {
    this.filteredAndPagedIssues = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.refreshService.hasChangesSubject$
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;

        return this.apiService.getUsersList(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize
        );
      }),
      map((data) => {
        this.isLoadingResults = false;
        this.resultsLength = data.count;

        return data.list;
      }),
      catchError(() => {
        this.isLoadingResults = false;

        return observableOf([]);
      })
    );
  }

  public resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  public openUpdateDialog(user: User) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      width: '300px',
      data: user,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap((user: User) => this.apiService.updateUser(user))
      )
      .subscribe({
        next: () => this.refreshService.hasChangesSubject$.next(),
      });
  }
}
