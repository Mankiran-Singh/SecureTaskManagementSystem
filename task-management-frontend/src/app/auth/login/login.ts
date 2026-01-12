import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
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
