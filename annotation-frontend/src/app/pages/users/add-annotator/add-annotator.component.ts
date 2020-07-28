import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-annotator',
  templateUrl: './add-annotator.component.html',
  styleUrls: ['./add-annotator.component.scss']
})
export class AddAnnotatorComponent implements OnInit {

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group(
      {
        username: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required]],
        confirmPassword: [null, [this.confirmValidator]],
        firstName: [''],
        lastName: [''],
        companyRole: [''],
        projects: [],
        status: ['A', [Validators.required]],
      },
    );
  }
  showModal = false;
  @Input() formError;
  @Input() projectOptions = [];
  @Input() set isModalVisible(value) {
    this.showModal = value;
    this.formError = null;
    this.resetForm(null);
  }
  @Output() submitedValue: EventEmitter<any> = new EventEmitter();
  @Output() isModalVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  validateForm: FormGroup;

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
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
    this.submitedValue.emit(value);
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
    this.validateForm.controls['status'].setValue('A');
    this.validateForm.controls['firstName'].setValue('');
    this.validateForm.controls['lastName'].setValue('');
  }

  closeModal() {
    this.isModalVisibleChange.emit(false);
    this.submitedValue.emit(null);
  }

  ngOnInit() {
  }

}
