import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailsComponent } from './project-details.component';
import { Routes, RouterModule } from '@angular/router';
import { TableModule } from 'src/app/components/table/table.module';
import { AddUserModule } from '../add-user/add-user.module';
import { UploadFileModule } from '../upload-file/upload-file.module';
import {
  NzButtonModule,
  NzIconModule,
  NzModalModule,
  NzTagModule,
  NzInputModule,
  NzNoAnimationModule,
  NzProgressModule,
  NzInputNumberModule
} from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {path: '', component: ProjectDetailsComponent}
]

@NgModule({
  declarations: [
    ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    TableModule,
    AddUserModule,
    UploadFileModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzTagModule,
    NzInputModule,
    NzNoAnimationModule,
    NzProgressModule,
    NzInputNumberModule
  ],
  exports: [
    ProjectDetailsComponent
  ]
})
export class ProjectDetailsModule { }
