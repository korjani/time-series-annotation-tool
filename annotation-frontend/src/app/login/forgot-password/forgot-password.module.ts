import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NzFormModule, NzModalModule, NzInputModule, NzButtonModule, NzIconModule } from 'ng-zorro-antd';

const routes: Routes = [
  { path: '', component: ForgotPasswordComponent },
  {
    path: ':key',
    loadChildren: './reset-password/reset-password.module#ResetPasswordModule',
  },
];

@NgModule({
  declarations: [
    ForgotPasswordComponent
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
export class ForgotPasswordModule { }
