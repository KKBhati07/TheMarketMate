import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  AppConfirmDeleteDialogComponent
} from '../../../shared/components/confirm-delete-dialog/app-confirm-delete-dialog.component';
import {User} from '../../../models/user.model';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'mm-admin-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUserListComponent implements OnDestroy {
  @Input() user: User | null = null;
  @Input() isMobile: boolean = false;
  @Output() deleteOrRestoreUser: EventEmitter<{ delete: boolean, uuid: string }>
    = new EventEmitter<{ delete: boolean, uuid: string }>()
  destroy$ = new Subject();

  constructor(private dialog: MatDialog) {
  }

  onDeleteClick(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(AppConfirmDeleteDialogComponent, {
      width: '400px',
      hasBackdrop: true,
      panelClass: 'delete-dialog-container',
      backdropClass: 'delete-dialog-backdrop',
      data: {
        name: this.user.name,
        isMobile: this.isMobile
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmDelete => {
        if (confirmDelete) {

          console.log(`User ${this.user?.name} deleted!`);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
