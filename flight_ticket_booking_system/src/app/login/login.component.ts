import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  onLoginSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      console.log('Login Form Submitted!', loginForm.value);
    } else {
      console.log('Login Form Invalid!');
    }
  }
}
