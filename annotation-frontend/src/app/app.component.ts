import { Component, OnInit } from '@angular/core';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private _shared: SharedService) {}

  currentUser;
  title = 'chart-ui';
  isCollapsed = false;

  getUserInfo() {
    this._shared.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getUserInfo();
  }
}
