import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { LoginReq } from "../dtoClasses/login-req";
import Swal from "sweetalert2";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth-service.service";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService,
    private authService: AuthService
  ) {}

  login = new LoginReq();

  onSubmit(form: any) {
    if (form.valid) {
      console.log(form.value);

      this.login.username = form.value.username;
      this.login.password = form.value.password;

      this.userAuthService.userLogin(this.login).subscribe(
        (response) => {
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "You have successfully logged in.",
            confirmButtonText: "OK",
          }).then(() => {
            form.reset();
            // Store token and role in AuthService
            this.authService.login(response.token, response.role);
            // Redirect based on role
            if (response.role === "ADMIN") {
              this.router.navigate(["/admin"]);
            } else if (response.role === "USER") {
              this.router.navigate(["/"]);
            }
          });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Login Failed!",
            text: error.error.message,
            confirmButtonText: "OK",
          });
          console.log(error);
        }
      );
    } else {
      Swal.fire({
        icon: "warning",
        title: "Form Invalid",
        text: "Please fill in all fields correctly.",
        confirmButtonText: "OK",
      });
    }
  }
}
