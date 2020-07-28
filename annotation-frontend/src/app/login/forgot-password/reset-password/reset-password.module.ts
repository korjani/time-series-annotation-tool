import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NzFormModule, NzModalModule, NzInputModule, NzButtonModule, NzIconModule } from 'ng-zorro-antd';

const routes: Routes = [
  { path: '', component: ResetPasswordComponent }
];


@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule
  ]
})
export class ResetPasswordModule { }
