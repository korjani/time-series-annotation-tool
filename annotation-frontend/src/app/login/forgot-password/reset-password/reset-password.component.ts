import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _auth: AuthService,
    private _router: Router,
    private _msg: NzMessageService) { }

  resetPasswordForm: FormGroup;
  resetPasswordToken = null;
  formError = {};
  
  resetPassword(e, formData): void {
    for (const i in this.resetPasswordForm.controls) {
      this.resetPasswordForm.controls[i].markAsDirty();
      this.resetPasswordForm.controls[i].updateValueAndValidity();
    }
    this.formError = {};
    const data = {
      password: formData['newPassword'],
      token: this.resetPasswordToken,
    };
    this._auth.resetPassword(data).subscribe(
      response => {
        this._msg.success('Password Changed Successfully!');
        this._router.navigate(['/login']);
      },
      error => {
        this.formError = error.error;
      }
    );
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.resetPasswordForm.controls['newPassword'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [this.confirmValidator]],
    });
    this._route.params.subscribe(param => {
      this.resetPasswordToken = param['key'];
    });
  }

}
