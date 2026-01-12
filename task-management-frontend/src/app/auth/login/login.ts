import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule, MatCardModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form;
  
    constructor(
      private fb: FormBuilder,
      private auth: AuthService,
      private router: Router
    ) {
      this.form = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        captcha: ['abc123'],
        serverCaptcha: ['abc123']
      });
    }

  login() {
    this.auth.login(this.form.value).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
