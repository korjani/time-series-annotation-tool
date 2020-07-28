import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { Routes, RouterModule } from '@angular/router';
import { TableModule } from 'src/app/components/table/table.module';
import { NzDropDownModule, NzButtonModule, NzIconModule, NzModalModule } from 'ng-zorro-antd';
import { AddProjectModule } from './add-project/add-project.module';
import { AddUserModule } from './add-user/add-user.module';
import { UploadFileModule } from './upload-file/upload-file.module';

const routes: Routes = [
  {path: '', component: ProjectsComponent},
  {path: ':id', loadChildren: './project-details/project-details.module#ProjectDetailsModule'},
];

@NgModule({
  declarations: [
    ProjectsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    AddProjectModule,
    AddUserModule,
    UploadFileModule
  ],
  exports: [
    ProjectsComponent
  ]
})
export class ProjectsModule { }
