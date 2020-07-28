import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddManagerComponent } from './add-manager.component';
import {
  NzModalModule,
  NzButtonModule,
  NzFormModule,
  NzCheckboxModule,
  NzInputModule, 
  NzSelectModule,
  NzInputNumberModule} from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddManagerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzCheckboxModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule
  ],
  exports: [
    AddManagerComponent
  ]
})
export class AddManagerModule { }
