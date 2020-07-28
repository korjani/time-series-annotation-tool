import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NzModalModule,
  NzUploadModule,
  NzButtonModule,
  NzFormModule,
  NzInputNumberModule,
  NzSelectModule, 
  NzCheckboxModule,
  NzIconModule
} from 'ng-zorro-antd';

@NgModule({
  declarations: [
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzUploadModule,
    NzButtonModule,
    NzFormModule,
    NzSelectModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzIconModule
  ],
  exports: [
    UploadFileComponent
  ]
})
export class UploadFileModule { }
