import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      invitation: [false]
    });
    this.validateForm.get('email')!.disable();
  }
  emailInvitation = false;
  showModal = false
  @Input() usernameList: string[] = [];
  @Output() isModalVisibleChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set isModalVisible(value) {
    this.showModal = value;
    this.isModalVisibleChange.emit(value);
  }
  @Output() submitedValue: EventEmitter<any> = new EventEmitter();
  validateForm: FormGroup;
  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.submitedValue.emit(value);
    this.resetForm(null);
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

  invitationChange(invitation: boolean): void {
    // this.emailInvitation = invitation;
    if (invitation) {
      this.validateForm.get('username')!.clearValidators();
      this.validateForm.get('username')!.markAsPristine();
      this.validateForm.get('username')!.disable();
      this.validateForm.get('email')!.setValidators([Validators.required, Validators.email]);
      this.validateForm.get('email')!.markAsDirty();
      this.validateForm.get('email')!.enable();
    } else {
      this.validateForm.get('email')!.clearValidators();
      this.validateForm.get('email')!.markAsPristine();
      this.validateForm.get('email')!.disable();
      this.validateForm.get('username')!.setValidators([Validators.required]);
      this.validateForm.get('username')!.markAsDirty();
      this.validateForm.get('username')!.enable();
    }
    this.validateForm.get('username')!.updateValueAndValidity();
    this.validateForm.get('email')!.updateValueAndValidity();
  }

  closeModal() {
    this.isModalVisible = false;
    this.submitedValue.emit(null);
  }

  ngOnInit() {
  }

}
