// admin-page.component.ts
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserDialogComponent } from "../user-dialog/user-dialog.component";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import Swal from "sweetalert2";

declare var $: any; // Declare jQuery for DataTable initialization

@Component({
  selector: "app-admin-page",
  standalone: false,
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.css"],
})
export class AdminPageComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: UserAuthServiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((response: any) => {
      console.log(response); // Debugging
      this.users = response;
      this.reinitializeDataTable(); // Ensure DataTable updates correctly
    });
  }

  openForm(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "600px",
      data: { user: null },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllUsers();
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "600px",
      data: { user: user },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllUsers();
    });
  }

  deleteUser(user: any): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the deletion if the user confirms
        this.userService.deleteUser(user.username).subscribe(
          (response) => {
            Swal.fire({
              icon: "success",
              title: "Deletion Successful!",
              text: response.message,
              confirmButtonText: "OK",
            });
            this.getAllUsers(); // Refresh the user list
          },
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error Deleting User!",
              text: error.error.message,
              confirmButtonText: "OK",
            });
          }
        );
      } else {
        // Optionally, show a cancellation message if the user cancels
        Swal.fire({
          icon: "info",
          title: "Deletion Cancelled",
          text: "The user was not deleted.",
          confirmButtonText: "OK",
        });
      }
    });
  }

  reinitializeDataTable() {
    setTimeout(() => {
      if ($.fn.dataTable.isDataTable("#userTable")) {
        $("#userTable").DataTable().destroy();
      }
      $("#userTable").DataTable({
        destroy: true,
        responsive: true,
        paging: true,
        searching: true,
      });
    }, 100);
  }

  trackByFn(index: number, user: any) {
    return user.id;
  }
}
