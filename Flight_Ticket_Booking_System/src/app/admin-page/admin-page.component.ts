import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-page',
  standalone: false,
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: UserAuthServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.users = response;
    });
  }

  openForm(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: null }  // Pass null to signify adding a new user
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllUsers();  // Refresh user list after dialog closes
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: user }  // Pass selected user to edit
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllUsers();  // Refresh user list after dialog closes
    });
  }

  deleteUser(user: any): void {
    this.userService.deleteUser(user.username).subscribe(
      () => {
        this.getAllUsers();
        Swal.fire({
          icon: 'success',
          title: 'User Deleted Successfully!',
          text: 'The user was deleted from the system.',
          confirmButtonText: 'OK',
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Deleting User!',
          text: error.error.message,
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
