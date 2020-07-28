import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _auth: AuthService,
    private _token: TokenService,
    private _router: Router) {}


  forgotForm: FormGroup;
  formStatus = 'forgot';
  formError = {};
  
  resetPassword(e, formData): void {
    for (const i in this.forgotForm.controls) {
      this.forgotForm.controls[i].markAsDirty();
      this.forgotForm.controls[i].updateValueAndValidity();
    }
    this.formError = {};
    if (this.forgotForm.invalid) {
      return;
    }
    const data = {
      email: formData['email'],
    };
    this._auth.resetPasswordByEmail(data).subscribe(
      response => {
        this.formStatus = 'msg';
      },
      error => {
        this.formError = error.error;
      }
    );
  }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

}
