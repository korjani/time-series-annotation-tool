import { Component, Output, EventEmitter, Input } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',

  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {
  

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      projectName: ['', [Validators.required]],
      group: ['', [Validators.required]],
      deadline: ['', [Validators.required]],
      instruction: ['', [Validators.maxLength(256)]],
      description: ['']
    });
  }
  isModalVisible = false;
  @Output() submitedValue: EventEmitter<any> = new EventEmitter();
  @Input() groupOptions = [];
  @Input() formError = {};
  @Input() set formResponse(res) {
    if (res) {
      this.resetForm(null);
      this.isModalVisible = false;
    }
  };
  validateForm: FormGroup;
  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    // console.log(value);
    this.submitedValue.emit(value);
  };

  resetForm(e: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    this.formError = {};
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
