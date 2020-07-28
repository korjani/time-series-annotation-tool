import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(private _project: ProjectService) { }

    userProjects: any = [];

    getProjectList() {
        this._project.getAllProjects().subscribe(
            response => {
                this.userProjects = response;
            },
            error => {}
        );
    }
 
    ngOnInit() {
        this.getProjectList();
    }

}
