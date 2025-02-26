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
  @Output() deleteOrRestoreUser: EventEmitter<{ action: string, uuid: string }>
    = new EventEmitter<{ action: string, uuid: string }>()
  destroy$ = new Subject();
  renderIcon = false;

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
        if (confirmDelete && this.user?.uuid) {
          this.deleteOrRestoreUser.emit({action: 'DELETE', uuid: this.user.uuid});
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onRestoreClick() {
    if (!this.user) return;
    this.deleteOrRestoreUser.emit({action: 'RESTORE', uuid: this.user.uuid});
  }

  onImageNotFound() {
    // this.
  }
}
