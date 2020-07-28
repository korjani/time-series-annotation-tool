import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { NzModalModule, NzButtonModule, NzFormModule, NzCheckboxModule, NzInputModule, NzSelectModule } from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddUserComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzCheckboxModule,
    NzInputModule,
    NzSelectModule  
  ],
  exports: [
    AddUserComponent
  ]
})
export class AddUserModule { }
