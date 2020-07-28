import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/services/manager.service';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {

  constructor(private _route: ActivatedRoute,
    private _group: GroupService,
    private _auth: AuthService,
    private _manager: ManagerService) { }
  
  group_id = null;
  group_details = null;
  deletedCount = 0;
  deletedItemType = null;
  deleteModalShow = false;
  addUserModalShow = false;
  selectedManagers = [];
  managerList: any = [];
  managerFields = {
    username: 'Username',
    fullname: 'Fullname',
    email: 'Email',
    status: 'Status',
    created_at: 'Joined',
    price: '$ / User'
  };
  managersList: any = [];

  showAddUserModal() {
    this.addUserModalShow = true;
  }

  showDeleteModal(count, type) {
    this.deletedCount = count;
    this.deletedItemType = type;
    this.deleteModalShow = true;
  }

  closeDeleteModal() {
    this.deleteModalShow = false;
  }

  deleteSelectedItem() {
    switch (this.deletedItemType) {
      case 'managers':
          const data = {
            manager_ids: this.group_details.manager_ids.filter(id => !this.selectedManagers.includes(id))
          };
          this._group.editGroup(data, this.group_id).subscribe(
            response => {
              this.group_details = response;
              this.managersList = response['managers'];
              this.selectedManagers = [];
              this.deletedItemType = null;
              this.closeDeleteModal();
            },
            error => {},
          );
        break;   
      default:
        break;
    }
    this.closeDeleteModal();
  }

  addUser(value) {
    let data = {};
    if (value.invitation) {
      data = {
        email: value.email,
        type: 'M',
        related_id: this.group_id
      };
      this._auth.userInvitation(data).subscribe(
        response => {
          this.managersList = [...this.managersList, response];
        },
        error => {},
      );
    } else {
      data = {
        manager_ids: [...this.group_details.manager_ids, value.username]
      };
      this._group.editGroup(data, this.group_id).subscribe(
        response => {
          this.group_details = response;
          this.managersList = response['managers'];
        },
        error => {},
      );
    }
    this.selectedManagers = [];
    this.addUserModalShow = false;
  }

  getManagerList() {
    this._manager.getAllManagers().subscribe(
      (response: Array<any>) => {
        this.managerList = response.map(manager => {
          const data = {
            id: manager.id,
            name: manager.user.username
          };
          return data;
        });
      },
      error => {}
    );
  }

  getGroupDetails() {
    this._group.getSingleGroup(this.group_id).subscribe(
      response => {
        this.group_details = response;
        this.managersList = response['managers'];
      },
      error => {}
    );
  }

  ngOnInit() {
    this.getManagerList();
    this._route.params.subscribe(param => {
      this.group_id = param['id'];
      this.getGroupDetails();
    });
  }

}
