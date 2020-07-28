import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectFileService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/api/v1/project-files/';

  getAllProjectFiles() {
    return this._http.get(this.ROOT_URL);
  }

  getSingleProjectFile(id) {
    return this._http.get(this.ROOT_URL + id + '/');
  }

  assignProjectFile(id) {
    return this._http.get(this.ROOT_URL + 'assign/' + id + '/');
  }

  addNewProjectFile(data) {
    const header = new HttpHeaders().set('enctype', 'multipart/form-data')
    return this._http.post(this.ROOT_URL, data, {headers: header});
  }

  deleteProjectFile(id) {
    return this._http.delete(this.ROOT_URL + id + '/');
  }

  editProjectFile(data, id) {
    return this._http.patch(this.ROOT_URL + id + '/', data);
  }
}
