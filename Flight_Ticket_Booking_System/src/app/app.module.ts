import { NgModule } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { UserDialogComponent } from "./user-dialog/user-dialog.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { AuthInterceptor } from "./core/interceptors/auth.service";
import { FlightDialogComponent } from './flight-dialog/flight-dialog.component';
import { FlightPageComponent } from './flight-page/flight-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminPageComponent,
    UserDialogComponent,
    ErrorPageComponent,
    FlightDialogComponent,
    FlightPageComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
