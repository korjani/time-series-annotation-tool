import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(private _shared: SharedService,
    private _auth: AuthService,
    private _token: TokenService,
    private _router: Router) { }

  currentUser;
  isCollapsed = false;

  logoutUser() {
    this._auth.logoutUser().subscribe(
      response => {
        this._shared.changeUser(null);
        this._token.clearToken();
        this._router.navigate(['./login']);
      },
      error => {}
    );
  }

  getUserInfo() {
    // this._shared.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
    if (!this._token.getToken()) {
      return;
    }
    this._auth.getUserInfo().subscribe(
      response => {
        this.currentUser = response;
        // this._shared.changeUser(response);
      },
      error => {},
      () => {
        this._auth.getUserType().subscribe(
          response => {
            this.currentUser['type'] = response['user_type'];
            this._shared.changeUser(this.currentUser);
          },
          error => {}
        );
      }
    );
    
  }

  ngOnInit() {
    this.getUserInfo();
  }

}
