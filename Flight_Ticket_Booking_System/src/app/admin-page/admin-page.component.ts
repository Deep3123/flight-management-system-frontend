import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import Swal from "sweetalert2"; // Import SweetAlert2
import { NgForm } from "@angular/forms"; // Import NgForm to use in the form reference
import { MatSnackBar } from "@angular/material/snack-bar"; // Keep if needed

declare var $: any; // jQuery declaration for DataTable

@Component({
  selector: "app-admin-page",
  standalone: false,
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.css"],
})
export class AdminPageComponent implements OnInit, AfterViewInit {
  users: any[] = [];
  openedIndex: number | null = null;
  isEditing = false;
  selectedUser: any = {}; // Initialize as empty object, not null

  @ViewChild("userForm") userForm!: NgForm;

  constructor(private userService: UserAuthServiceService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit(): void {
    // Initialize the DataTable after the view has been initialized
    $("#userTable").DataTable(); // Initialize DataTable
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.users = response;
    });
  }

  toggleDetails(index: number): void {
    this.openedIndex = this.openedIndex === index ? null : index;
  }

  openForm(): void {
    this.isEditing = false;
    this.selectedUser = {};
    this.userForm.resetForm();
  }

  editUser(user: any): void {
    this.isEditing = true;
    this.selectedUser = { ...user };
    this.userForm.setValue({
      name: user.name,
      emailId: user.emailId,
      mobileNo: user.mobileNo,
      username: user.username,
      password: user.password,
      role: user.role,
    });
  }

  deleteUser(user: any): void {
    this.userService.deleteUser(user.username).subscribe(
      () => {
        this.getAllUsers();
        Swal.fire({
          icon: "success",
          title: "User Deleted Successfully!",
          text: "The user was deleted from the system.",
          confirmButtonText: "OK",
        });
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
  }

  submitForm() {
    if (this.isEditing && this.selectedUser) {
      this.userService
        .updateUser({ ...this.selectedUser, ...this.userForm.value })
        .subscribe(
          () => {
            this.getAllUsers();
            Swal.fire({
              icon: "success",
              title: "User Updated Successfully!",
              text: "The user information was updated.",
              confirmButtonText: "OK",
            });
          },
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error Updating User!",
              text: error.error.message,
              confirmButtonText: "OK",
            });
          }
        );
    } else {
      this.userService.saveUserData(this.userForm.value).subscribe(
        () => {
          this.getAllUsers();
          Swal.fire({
            icon: "success",
            title: "User Added Successfully!",
            text: "The new user was added to the system.",
            confirmButtonText: "OK",
          });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error Adding User!",
            text: error.error.message,
            confirmButtonText: "OK",
          });
        }
      );
    }
  }
}
