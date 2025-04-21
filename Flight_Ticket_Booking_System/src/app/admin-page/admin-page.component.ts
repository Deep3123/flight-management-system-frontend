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
  // Column definitions
  displayedColumns: string[] = ['position', 'name', 'email', 'username', 'phone', 'role', 'createdAt', 'updatedAt', 'actions'];
  dataSource: MatTableDataSource<any>;
  users: any[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserAuthServiceService,
    public dialog: MatDialog
  ) {
    // Initialize an empty data source
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    // Store users in localStorage when page loads or refreshes
    window.addEventListener('beforeunload', () => {
      if (this.users && this.users.length > 0) {
        localStorage.setItem('adminUsers', JSON.stringify(this.users));
        localStorage.setItem('adminPaginatorIndex', this.paginator?.pageIndex?.toString() || '0');
        localStorage.setItem('adminPaginatorSize', this.paginator?.pageSize?.toString() || '10');
      }
    });

    // Try to load from localStorage first
    const storedUsers = localStorage.getItem('adminUsers');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.dataSource = new MatTableDataSource(this.users);
      // Don't set paginator here - will do it in ngAfterViewInit
    }

    // Always get fresh data from server
    this.getAllUsers();
  }

  ngAfterViewInit() {
    // Set paginator and sort after view init
    if (this.dataSource) {
      // Initialize paginator
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Now restore the saved pagination state from localStorage
      setTimeout(() => {
        if (this.paginator) {
          const pageIndex = Number(localStorage.getItem('adminPaginatorIndex') || '0');
          const pageSize = Number(localStorage.getItem('adminPaginatorSize') || '10');

          // First set the page size
          this.paginator.pageSize = pageSize;

          // Then set the page index
          this.paginator.pageIndex = pageIndex;

          // Force paginator to update
          this.paginator.page.emit({
            pageIndex: pageIndex,
            pageSize: pageSize,
            length: this.dataSource.data.length
          });
        }
      });

      // Fix for sequential row numbers across pages
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'position': return 0; // Position is handled specially 
          default: return item[property];
        }
      };
    }
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

        // Store in localStorage for persistence on page refresh
        localStorage.setItem('adminUsers', JSON.stringify(this.users));

        this.dataSource = new MatTableDataSource(this.users);

        // Always reinitialize the paginator and sort after getting new data
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;

          // Restore pagination state if available
          const pageIndex = Number(localStorage.getItem('adminPaginatorIndex') || '0');
          const pageSize = Number(localStorage.getItem('adminPaginatorSize') || '5');

          // Apply the saved pagination
          setTimeout(() => {
            this.paginator.pageSize = pageSize;
            this.paginator.pageIndex = pageIndex;

            // Force paginator to update
            this.paginator.page.emit({
              pageIndex: pageIndex,
              pageSize: pageSize,
              length: this.dataSource.data.length
            });
          });
        }

        if (this.sort) {
          this.dataSource.sort = this.sort;
        }

        // Customize the data accessor for calculation of position
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'position': return 0; // Position is calculated in the template
            default: return item[property];
          }
        };
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

  // Get the actual row number across all pages
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
      if (result) { // If dialog returns a result (successful operation)
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
      if (result) { // If dialog returns a result (successful operation)
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
}