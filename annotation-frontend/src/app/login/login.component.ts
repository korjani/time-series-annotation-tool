import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _auth: AuthService,
    private _token: TokenService,
    private _router: Router) {}

  validateForm: FormGroup;

  loginUser(e, formData): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const data = {
      username: formData['userName'],
      password: formData['password']
    };
    this._auth.loginUser(data).subscribe(
      response => {
        this._token.setToken(response['key']);
        // this._shared.changeUser(response['user']);
        this._router.navigate(['']);
      },
      error => {}
    );
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
