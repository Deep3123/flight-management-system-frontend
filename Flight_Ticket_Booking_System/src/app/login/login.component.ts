import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { LoginReq } from "../dtoClasses/login-req";
import Swal from "sweetalert2";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth-service.service";
import { CaptchaServiceService } from "../services/captcha-service.service";

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
    private authService: AuthService,
    private captchaService: CaptchaServiceService
  ) {}

  login = new LoginReq();
  captchaInput: string = "";
  captchaUrl: string = ""; // Will hold the CAPTCHA image URL
  isLoading: any = false;

  // captchaUrl: string = "/api/captcha?" + new Date().getTime(); // prevent caching
  // captchaInput: string = "";

  // reloadCaptcha() {
  //   this.captchaUrl = "/api/captcha?" + new Date().getTime();
  // }

  // Add this property to control password visibility
  showPassword: boolean = true;

  // Get a fresh CAPTCHA image when the component is initialized
  ngOnInit() {
    this.loadCaptcha();
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loadCaptcha() {
    this.captchaService.getCaptchaImage().subscribe(
      (response: Blob) => {
        // Create a URL for the blob image
        this.captchaUrl = URL.createObjectURL(response);
      },
      (error) => {
        // ✅ Ensure error message is displayed properly
        const errorMessage =
          error.message ||
          error.error?.message ||
          "Error fetching CAPTCHA image.";

        Swal.fire({
          icon: "error",
          title: "Captcha not loading!",
          text: errorMessage,
          confirmButtonText: "OK",
        });
      }
    );
  }

  // Method to reload CAPTCHA image
  reloadCaptcha() {
    this.loadCaptcha(); // Simply reload the CAPTCHA by calling the loadCaptcha method again
  }

  onSubmit(form: any) {
    if (form.valid) {
      // console.log(form.value);

      this.login.username = form.value.username;
      this.login.password = form.value.password;
      this.login.captchaInput = form.value.captchaInput; // ✅ include captcha input

      this.isLoading = true;
      this.userAuthService.userLogin(this.login).subscribe(
        (response) => {
          this.isLoading = false;
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
          this.isLoading = false;
          console.log(error);

          // ✅ Ensure error message is displayed properly
          const errorMessage =
            error.error?.message ||
            error.error?.error?.message ||
            "Login failed. Please try again.";

          Swal.fire({
            icon: "error",
            title: "Login Failed!",
            text: errorMessage,
            confirmButtonText: "OK",
          });
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
