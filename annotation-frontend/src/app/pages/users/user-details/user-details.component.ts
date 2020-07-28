import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _msg: NzMessageService,
    private _route: ActivatedRoute,
    private _user: UserService,
    private _auth: AuthService) {
      this.validateForm = this.fb.group(
        {
          oldPassword: [null, [Validators.required]],
          newPassword: [null, [Validators.required]],
          confirmPassword: [null, [this.confirmValidator]],
        },
      );
    }
  
  validateForm: FormGroup;
  user_id = null;
  user_data = null;
  editUserModalShow = false;

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['newPassword'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this._auth.changePassword(value).subscribe(
      response => {
        this.validateForm.reset();
        this._msg.success('password changed successfully.');
      },
      error => {
        this._msg.error('change password failed.');
      }
    );
  };

  resetForm(e: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
      
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  getUserProfile() {
    this._user.userProfile(this.user_id).subscribe(
      response => {
        this.user_data = response;
      },
      error => {},
    );
  }

  editUser(value) {
    if (!value) {
      return;
    }
    const data = {
      username: value['username'],
      email: value['email'],
      first_name: value['firstName'],
      last_name: value['lastName'],
    };

    this._user.editUserProfile(this.user_id, data).subscribe(
      response => {
        this.user_data = response;
      },
      error => {},
    );
  }

  ngOnInit() {
    this._route.params.subscribe(param => {
      this.user_id = param['id'];
      this.getUserProfile();
    });
  }

}
