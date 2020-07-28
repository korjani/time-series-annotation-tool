import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      groupName: ['', [Validators.required]],
    });
  }
  showModal = false
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

  closeModal() {
    this.isModalVisible = false;
    this.submitedValue.emit(null);
  }

  ngOnInit() {
  }

}
