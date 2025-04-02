import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { authGuard } from "./services/auth.guard";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { FlightPageComponent } from "./flight-page/flight-page.component";
import { ContactComponent } from "./contact/contact.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  {
    path: "reset-password/:username/:timestamp/:token",
    component: ResetPasswordComponent,
  },
  {
    path: "admin",
    component: AdminPageComponent,
    canActivate: [authGuard], // Apply the guard to this route
    data: { role: "ADMIN" }, // Specify that the user should be an ADMIN
  },
  {
    path: "flight",
    component: FlightPageComponent,
    canActivate: [authGuard], // Apply the guard to this route
    data: { role: "ADMIN" }, // Specify that the user should be an ADMIN
  },
  { path: "contact-us", component: ContactComponent, canActivate: [authGuard] },
  { path: "", component: HomeComponent },
  { path: "**", component: ErrorPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
      onSameUrlNavigation: "reload",
      scrollOffset: [0, 50],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
