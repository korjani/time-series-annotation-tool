import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _auth: AuthService,
    private _token: TokenService,
    private _router: Router,
    private _route: ActivatedRoute) {}


  validateForm: FormGroup;
  registerToken = null;
  formError = {};

  checkPasswords(group: FormGroup) {
  let pass = group.get('password').value;
  let confirmPass = group.get('confirmPassword').value;

  return pass === confirmPass ? null : { notSame: true }     
}

  submitForm(e, formData): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.formError = {};
    const data = {
      username: formData['username'],
      password: formData['password'],
      first_name: formData['firstName'],
      last_name: formData['lastName'],
      token: this.registerToken
    };
    this._auth.registerUser(data).subscribe(
      response => {
        console.log(response);
        this._token.setToken(response['key']);
        this._router.navigate(['']);
      },
      error => {
        this.formError = error.error;
      }
    );
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null],
      firstName: [null],
      lastName: [null],
    }, {validator: this.checkPasswords });
    this._route.params.subscribe(param => {
      this.registerToken = param['key'];
    });
  }

}
