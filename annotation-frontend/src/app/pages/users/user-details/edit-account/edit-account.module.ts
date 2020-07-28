import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAccountComponent } from './edit-account.component';
import {
  NzModalModule,
  NzButtonModule,
  NzFormModule,
  NzAutocompleteModule,
  NzCheckboxModule,
  NzInputModule, 
  NzSelectModule} from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditAccountComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzCheckboxModule,
    NzInputModule,
    NzAutocompleteModule,
    NzSelectModule
  ],
  exports: [
    EditAccountComponent
  ]
})
export class EditAccountModule { }
