// import { Component, OnInit } from "@angular/core";
// import Swal from "sweetalert2";
// import { AuthService } from "../services/auth-service.service";
// import { Router } from "@angular/router";

// @Component({
//   selector: "app-navbar",
//   standalone: false,
//   templateUrl: "./navbar.component.html",
//   styleUrls: ["./navbar.component.css"],
// })
// export class NavbarComponent implements OnInit {
//   isLoggedIn: boolean = false;
//   darkMode: boolean = false;
//   isAdmin: boolean = false;
//   isMobileView: boolean = false; // Flag to detect mobile view
//   isDropdownOpen: boolean = false; // Flag to track dropdown state

//   constructor(private authService: AuthService, private route: Router) {}

//   ngOnInit(): void {
//     // Subscribe to the login status
//     this.authService.isLoggedIn$.subscribe((loggedInStatus) => {
//       this.isLoggedIn = loggedInStatus;
//     });

//     // Subscribe to the admin status
//     this.authService.isAdmin$.subscribe((adminStatus) => {
//       this.isAdmin = adminStatus;
//     });

//     // Check for saved theme in localStorage (only available in the browser)
//     if (this.isBrowser() && localStorage.getItem("theme")) {
//       const savedTheme = localStorage.getItem("theme");
//       if (savedTheme) {
//         this.darkMode = savedTheme === "dark";
//         this.applyTheme();
//       }
//     }

//     // Initialize screen size detection
//     this.checkScreenSize();

//     // Add resize listener for screen size change, only in the browser
//     if (this.isBrowser()) {
//       window.addEventListener("resize", () => this.checkScreenSize());
//     }
//   }

//   // Check if the code is running in the browser (client-side)
//   isBrowser(): boolean {
//     return typeof window !== "undefined";
//   }

//   // Detect mobile/desktop screen size
//   checkScreenSize() {
//     if (this.isBrowser()) {
//       this.isMobileView = window.innerWidth < 768; // Adjust the breakpoint as needed
//     }
//   }

//   // Toggle the dropdown icon and state
//   toggleDropdown(): void {
//     this.isDropdownOpen = !this.isDropdownOpen;
//   }

//   logout(): void {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out and redirected to the home page.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, log me out!",
//       cancelButtonText: "No, stay logged in!",
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6B7280",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Proceed with logout if the user confirms
//         this.authService.logout(); // Call logout method from AuthService
//         Swal.fire({
//           icon: "info",
//           title: "Logged Out",
//           text: "You have successfully logged out.",
//           confirmButtonText: "OK",
//         });
//         this.route.navigate(["/"]); // Navigate to the home page
//       } else {
//         // Optionally, show a cancellation message if the user cancels
//         Swal.fire({
//           icon: "info",
//           title: "Logout Cancelled",
//           text: "You are still logged in.",
//           confirmButtonText: "OK",
//         });
//       }
//     });
//   }

//   // Toggle dark/light mode
//   toggleTheme(): void {
//     this.darkMode = !this.darkMode;
//     this.applyTheme();
//   }

//   // Apply the theme to the body and store in localStorage
//   applyTheme(): void {
//     if (this.isBrowser()) {
//       if (this.darkMode) {
//         document.body.classList.add("dark-mode");
//         localStorage.setItem("theme", "dark");
//       } else {
//         document.body.classList.remove("dark-mode");
//         localStorage.setItem("theme", "light");
//       }
//     }
//   }
// }


import { Component, OnInit, OnDestroy } from "@angular/core";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth-service.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-navbar",
  standalone: false,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  darkMode: boolean = false;
  isAdmin: boolean = false;
  isMobileView: boolean = false; // Flag to detect mobile view
  isDropdownOpen: boolean = false; // Flag to track dropdown state
  
  // Track subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check the auth status on component initialization
    this.authService.checkAuthStatus();
    
    // Monitor route changes to handle query params
    this.subscriptions.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Check for query parameters on route change
        this.handleQueryParams();
      })
    );
    
    // Subscribe to auth state
    this.subscriptions.push(
      this.authService.isLoggedIn$.subscribe(loggedIn => {
        // console.log("Auth state changed:", loggedIn);
        this.isLoggedIn = loggedIn;
      })
    );
    
    // Subscribe to admin state
    this.subscriptions.push(
      this.authService.isAdmin$.subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      })
    );

    // Initial check for query parameters
    this.handleQueryParams();

    // Check for saved theme in localStorage
    if (this.isBrowser() && localStorage.getItem("theme")) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        this.darkMode = savedTheme === "dark";
        this.applyTheme();
      }
    }

    // Initialize screen size detection
    this.checkScreenSize();

    // Add resize listener for screen size change
    if (this.isBrowser()) {
      window.addEventListener("resize", () => this.checkScreenSize());
    }
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Remove resize listener
    if (this.isBrowser()) {
      window.removeEventListener("resize", () => this.checkScreenSize());
    }
  }
  
  // Handle query parameters for OAuth redirect
  private handleQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      // Handle OAuth redirect with token in URL
      if (params['token']) {
        // Get current URL path
        const currentPath = this.router.url.split('?')[0];
        
        // Get the role if present, otherwise default to 'USER'
        const role = params['role'] || 'USER';
  
        // Handle the OAuth token
        this.authService.handleOAuthRedirect(params['token'], role, true);
  
        // Only clean URL parameters if we're on the home page, NOT on complete-profile
        if (currentPath === '/' || currentPath === '/home') {
          // Clean URL by removing query parameters
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true // This replaces current URL in browser history
          });
          
          // Show success notification
          this.showLoginSuccessNotification();
        }
      }
    });
  }

  // Show login success notification
  private showLoginSuccessNotification(): void {
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "You have been successfully logged in.",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true,
    });
  }

  // Check if the code is running in the browser
  isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  // Detect mobile/desktop screen size
  checkScreenSize() {
    if (this.isBrowser()) {
      this.isMobileView = window.innerWidth < 768; // Adjust the breakpoint as needed
    }
  }

  // Toggle the dropdown icon and state
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out and redirected to the home page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "No, stay logged in!",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with logout if the user confirms
        this.authService.logout(); // Call logout method from AuthService
        Swal.fire({
          icon: "info",
          title: "Logged Out",
          text: "You have successfully logged out.",
          confirmButtonText: "OK",
        });
        this.router.navigate(["/"]); // Navigate to the home page
      } else {
        // Optionally, show a cancellation message if the user cancels
        Swal.fire({
          icon: "info",
          title: "Logout Cancelled",
          text: "You are still logged in.",
          confirmButtonText: "OK",
        });
      }
    });
  }

  // Toggle dark/light mode
  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.applyTheme();
  }

  // Apply the theme to the body and store in localStorage
  applyTheme(): void {
    if (this.isBrowser()) {
      if (this.darkMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    }
  }
}