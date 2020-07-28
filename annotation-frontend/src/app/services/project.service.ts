import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/api/v1/projects/';

  getAllProjects() {
    return this._http.get(this.ROOT_URL);
  }

  getSingleProject(id) {
    return this._http.get(this.ROOT_URL + id + '/');
  }

  getDashboardProject(id) {
    return this._http.get(this.ROOT_URL + 'dashboard/' + id + '/');
  }

  addNewProject(data) {
    return this._http.post(this.ROOT_URL, data);
  }

  deleteProject(id) {
    return this._http.delete(this.ROOT_URL + id + '/');
  }

  editProject(data, id) {
    return this._http.patch(this.ROOT_URL + id + '/', data);
  }
}
