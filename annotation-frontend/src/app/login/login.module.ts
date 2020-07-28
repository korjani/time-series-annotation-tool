import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NzFormModule, NzModalModule, NzInputModule, NzButtonModule, NzIconModule } from 'ng-zorro-antd';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [
    LoginComponent
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

  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
