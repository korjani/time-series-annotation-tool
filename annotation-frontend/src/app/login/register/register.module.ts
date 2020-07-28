import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NzFormModule, NzModalModule, NzInputModule, NzButtonModule, NzIconModule } from 'ng-zorro-antd';

const routes: Routes = [
  { path: '', component: RegisterComponent }
];

@NgModule({
  declarations: [
    RegisterComponent
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
    RegisterComponent
  ]
})
export class RegisterModule { }
