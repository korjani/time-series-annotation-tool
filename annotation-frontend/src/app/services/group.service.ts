import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/api/v1/groups/';

  getAllGroups() {
    return this._http.get(this.ROOT_URL);
  }

  getSingleGroup(id) {
    return this._http.get(this.ROOT_URL + id + '/');
  }

  addNewGroup(data) {
    return this._http.post(this.ROOT_URL, data);
  }

  deleteGroup(id) {
    return this._http.delete(this.ROOT_URL + id + '/');
  }

  editGroup(data, id) {
    return this._http.patch(this.ROOT_URL + id + '/', data);
  }

}
