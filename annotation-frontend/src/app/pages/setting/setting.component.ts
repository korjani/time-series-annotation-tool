import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(private _group: GroupService) { }

  selectedGroups = [];
  deletedCount = 0;
  deletedItemType = null;
  addGroupModalShow = false;
  deleteModalShow = false;
  groupFields = {
    name: 'Group Name',
    projects: 'Project(s)',
    managers: 'Manager(s)',
  };
  groupsList: any = [];

  addGroup(value) {
    const data = {
      name: value.groupName
    };

    this._group.addNewGroup(data).subscribe(
      response => {
        this.addGroupModalShow = false;
        this.groupsList = [...this.groupsList , response];
      },
      error => {}
    );
    // this.selectedGroups = [];
  }

  deleteSelectedItem() {
    const deleted = [];
    this.selectedGroups.forEach((group_id, i) => {
      this._group.deleteGroup(group_id).subscribe(
        response => {
          deleted.push(group_id);
          if ( i === this.selectedGroups.length - 1 )  {
            this.groupsList = this.groupsList.filter(item => !deleted.includes(item.id));
            this.selectedGroups = [];
            this.closeDeleteModal();
          }
        },
        error => {}
      );
    });
  }

  showDeleteModal(count, type) {
    this.deletedCount = count;
    this.deletedItemType = type;
    this.deleteModalShow = true;
  }

  closeDeleteModal() {
    this.deleteModalShow = false;
  }

  getGroupsList() {
    this._group.getAllGroups().subscribe(
      response => {
        this.groupsList = response;
      },
      error => {
      }
    );
  }
  

  ngOnInit() {
    this.getGroupsList();
  }

}
