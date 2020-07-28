import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        firstName: [''],
        lastName: [''],
        // companyRole: [''],
      },
    );
  }
  showModal = false;
  user_data = null;
  @Output() isModalVisibleChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set isModalVisible(value) {
    this.showModal = value;
    this.isModalVisibleChange.emit(value);
    if (value) {
      this.initForm();
    }
  }
  @Input() set userData(value) {
    if (!value) {
      return;
    }
    this.user_data = value;
    this.initForm();
  }
  @Output() submitedValue: EventEmitter<any> = new EventEmitter();
  validateForm: FormGroup;

  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    // console.log(value);
    this.submitedValue.emit(value);
    this.isModalVisible = false;
    this.resetForm(null);
  };

  initForm() {
    if (!this.user_data) {
      return;
    }
    this.validateForm.controls['username'].setValue(this.user_data['username']);
    this.validateForm.controls['email'].setValue(this.user_data['email']);
    this.validateForm.controls['firstName'].setValue(this.user_data['first_name']);
    this.validateForm.controls['lastName'].setValue(this.user_data['last_name']);
    // this.validateForm.controls['companyRole'].setValue(this.user_data['companyRole']);
  }

  resetForm(e: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
      
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.validateForm.controls['firstName'].setValue('');
    this.validateForm.controls['lastName'].setValue('');
  }

  closeModal() {
    this.isModalVisible = false;
    this.submitedValue.emit(null);
  }

  ngOnInit() {
  }

}
