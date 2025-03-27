import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import Swal from "sweetalert2";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-user-dialog",
  standalone: false,
  templateUrl: "./user-dialog.component.html",
  styleUrls: ["./user-dialog.component.css"],
})
export class UserDialogComponent {
  isEditing = false;
  selectedUser: any = {};

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserAuthServiceService
  ) {
    if (data.user) {
      this.isEditing = true;
      this.selectedUser = { ...data.user };
    }
  }

  onNoClick(): void {
    Swal.fire({
      icon: "info",
      title: "Update Operation cancelled!",
      text: "The user information was not updated, as you have cancelled the operation!!",
      confirmButtonText: "OK",
    });
    this.dialogRef.close();
  }

  submitForm(userForm: NgForm): void {
    if (this.isEditing) {
      this.userService
        .updateUser({ ...this.selectedUser, ...userForm.value })
        .subscribe(
          () => {
            this.dialogRef.close();
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
      this.userService.saveUserData(userForm.value).subscribe(
        () => {
          this.dialogRef.close();
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
