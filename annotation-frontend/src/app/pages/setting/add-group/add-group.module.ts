import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddGroupComponent } from './add-group.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzModalModule, NzButtonModule, NzInputModule, NzFormModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [
    AddGroupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
  ],
  exports: [
    AddGroupComponent
  ]
})
export class AddGroupModule { }
