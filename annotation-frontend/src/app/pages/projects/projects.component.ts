import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { GroupService } from 'src/app/services/group.service';
import { AnnotatorService } from 'src/app/services/annotator.service';
import { ProjectFileService } from 'src/app/services/project-file.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  constructor(private _project: ProjectService,
    private _group: GroupService,
    private _auth: AuthService,
    private _annotator: AnnotatorService,
    private _proj_file: ProjectFileService,
    private _shared: SharedService) { }
  
  uploadResult = null;
  isModalVisible = false;
  addUserModalShow = false;
  addFileModalShow = false;
  addUserType = null;
  addProjectError = {};
  addProjectResponse = false;
  availableGroup: any = [];
  availableUser = [];
  selectedProjects = [];
  shared_sub;
  current_user;

  tableHeaderData: any = {
    name: 'Project Name',
    group_name: 'Group',
    description: 'Description',
    instruction: 'Instruction',
    deadline: 'Deadline',
  }

  projectsList: any = [];
  managerList: any = [];
  annotatorList: any = [];

  closeModal() {
    this.isModalVisible = false;
  }

  addProject(value) {
    const data = {
      name: value.projectName,
      group: value.group,
      description: value.description,
      instruction: value.instruction,
      deadline: value.deadline,
      tags: []
    };
    this._project.addNewProject(data).subscribe(
      response => {
        this.addProjectResponse = true;
        this.projectsList = [...this.projectsList, response];
        setTimeout(() => {
          this.addProjectResponse = false;
        }, 10);
      },
      error => {
        this.addProjectError = error.error;
      }
    );
  }

  deleteProjects() {
    const deleted = [];
    this.selectedProjects.forEach((id, i) => {
      this._project.deleteProject(id).subscribe(
        response => {
          deleted.push(id);
          if ( i === this.selectedProjects.length - 1 )  {
            this.handleDeleteResponse(deleted);
          }
        },
        error => {
          if ( i === this.selectedProjects.length - 1 )  {
            this.handleDeleteResponse(deleted);
          }
        }
      );
    });
  }

  handleDeleteResponse(deleted_ids) {
    this.projectsList = this.projectsList.filter(item => !deleted_ids.includes(item.id));
    this.selectedProjects = [];
    this.closeModal();
  }

  showAddUserModal(type) {
    this.addUserModalShow = true;
    this.addUserType = type
    if (type === 'manager') {
      this.availableUser = this.managerList;
    } else if (type === 'annotator') {
      this.availableUser = this.annotatorList;
    }
  }

  addUser(value) {
    if (!value) {
      return;
    }
    if (this.addUserType === 'manager') {
      // this.availableUser = this.managerList;
      this.selectedProjects = [];
    } else if (this.addUserType === 'annotator') {
      let data = {};
      const selectedP = this.projectsList.filter(project => this.selectedProjects.includes(project.id));
      if (value.invitation) {
        selectedP.forEach(project => {
          data = {
            email: value.email,
            type: 'A',
            related_id: project.id
          };
          this._auth.userInvitation(data).subscribe(
            response => {
              project['annotators'] = [...project['annotators'], response['id']];
            },
            error => {},
          );
        });
      } else {
        selectedP.forEach(project => {
          data = {
            annotator_ids: [...project.annotators, value.username]
          };
          this._project.editProject(data, project.id).subscribe(
            response => {
              project['annotators'] = response['annotator_ids'];
            },
            error => {},
          );
        });
      }
    }
    this.addUserType = null;
    this.addUserModalShow = false;
    this.availableUser = [];
    this.selectedProjects = [];
  }

  uploadFileToProject(files) {    
    if (files) {
      // let data = {};
      const selectedP = this.projectsList.filter(project => this.selectedProjects.includes(project.id));

      selectedP.forEach(project => {

        const data: FormData = new FormData();
        data.append('file', files.files[0]);
        data.append('project', project.id);
        data.append('data_type', files.type['xDataType']);
        data.append('curves_count', files.type['curveNumber']);
        data.append('is_vertical', files.type['isVertical']);
        this._proj_file.addNewProjectFile(data).subscribe(
          response => {
            this.uploadResult = 'success';
          },
          error => {
            this.uploadResult = 'failed';
          }
        );
      });
      this.selectedProjects = [];
      this.uploadResult = null;
    }
      
  }

  getGroupList() {
    this._group.getAllGroups().subscribe(
      response => {
        this.availableGroup = response;
      },
      error => {}
    );
  }

  getProjectList() {
    this._project.getAllProjects().subscribe(
      response => {
        this.projectsList = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  getAnnotatorList() {
    this._annotator.getAllAnnotators().subscribe(
      (response: Array<any>) => {
        this.annotatorList = response.map(annotator => {
          const data = {
            id: annotator.id,
            name: annotator.user.username
          };
          return data;
        });
      },
      error => {}
    );
  }

  getUserType() {
    this.shared_sub = this._shared.currentUser.subscribe(
      user => {
        this.current_user = user;
        if (user && user['type'] === 'Admin') {
          this.getGroupList();
        }
        this.getProjectList();
        this.getAnnotatorList();
      }
    );
  }

  ngOnInit() {
    this.getUserType();
  }

  ngOnDestroy() {
    if (this.shared_sub) {
      this.shared_sub.unsubscribe();
    }
  }

}
