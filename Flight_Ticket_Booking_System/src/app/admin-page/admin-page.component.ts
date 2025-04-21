// // admin-page.component.ts
// import { Component, OnInit, AfterViewInit } from "@angular/core";
// import { MatDialog } from "@angular/material/dialog";
// import { UserDialogComponent } from "../user-dialog/user-dialog.component";
// import { UserAuthServiceService } from "../services/user-auth-service.service";
// import Swal from "sweetalert2";

// declare var $: any; // Declare jQuery for DataTable initialization

// @Component({
//   selector: "app-admin-page",
//   standalone: false,
//   templateUrl: "./admin-page.component.html",
//   styleUrls: ["./admin-page.component.css"],
// })
// export class AdminPageComponent implements OnInit {
//   users: any[] = [];
//   isLoading: any = false;

//   constructor(
//     private userService: UserAuthServiceService,
//     public dialog: MatDialog
//   ) {}

//   ngOnInit(): void {
//     this.getAllUsers();
//   }

//   getAllUsers() {
//     this.isLoading = true;
//     this.userService.getAllUsers().subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         // console.log(response); // Debugging
//         this.users = response;
//         this.reinitializeDataTable(); // Ensure DataTable updates correctly
//       },
//       (error) => {
//         Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text:
//             error.message ||
//             error.error.message ||
//             "Error while fetching data!",
//           confirmButtonText: "OK",
//         });
//       }
//     );
//   }

//   openForm(): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: "600px",
//       data: { user: null },
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.getAllUsers();
//     });
//   }

//   editUser(user: any): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: "600px",
//       data: { user: user },
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.getAllUsers();
//     });
//   }

//   deleteUser(user: any): void {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Proceed with the deletion if the user confirms
//         this.userService.deleteUser(user.username).subscribe(
//           (response) => {
//             Swal.fire({
//               icon: "success",
//               title: "Deletion Successful!",
//               text: response.message,
//               confirmButtonText: "OK",
//             });
//             this.getAllUsers(); // Refresh the user list
//           },
//           (error) => {
//             Swal.fire({
//               icon: "error",
//               title: "Error Deleting User!",
//               text: error.error.message,
//               confirmButtonText: "OK",
//             });
//           }
//         );
//       } else {
//         // Optionally, show a cancellation message if the user cancels
//         Swal.fire({
//           icon: "info",
//           title: "Deletion Cancelled",
//           text: "The user details have not been deleted.",
//           confirmButtonText: "OK",
//         });
//       }
//     });
//   }

//   reinitializeDataTable() {
//     setTimeout(() => {
//       if ($.fn.dataTable.isDataTable("#userTable")) {
//         $("#userTable").DataTable().destroy();
//       }
//       $("#userTable").DataTable({
//         destroy: true,
//         responsive: true,
//         paging: true,
//         searching: true,
//       });
//     }, 100);
//   }

//   trackByFn(index: number, user: any) {
//     return user.id;
//   }
// }

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-page',
  standalone: false,
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, AfterViewInit {
  users: any[] = [];
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);
  private destroy$ = new Subject<void>();

  // Column definitions
  displayedColumns: string[] = [
    'position',
    'name',
    'email',
    'username',
    'phone',
    'role',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserAuthServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit() {
    // Connect the sort and paginator to the data source
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Filter function for the search box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.users = response;
        // Update the data source with new data
        this.dataSource.data = this.users;
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.message || error.error?.message || 'Error while fetching data!',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Get the actual row number
  getRowNumber(i: number): number {
    if (!this.paginator) return i + 1;
    return i + 1 + this.paginator.pageIndex * this.paginator.pageSize;
  }

  openForm(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: { user: null }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.getAllUsers();
      }
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: { user: user }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.getAllUsers();
      }
    });
  }

  deleteUser(user: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.userService.deleteUser(user.username).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (response) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: response.message || 'User has been deleted.',
              confirmButtonText: 'OK'
            });
            this.getAllUsers();
          },
          error: (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.error?.message || 'Error deleting user!',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  // Track function for ngFor performance optimization
  trackByFn(index: number, user: any) {
    return user.id || user.username;
  }
}