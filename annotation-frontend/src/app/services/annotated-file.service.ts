import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnotatedFileService {

  constructor(private _http: HttpClient) { }

  private ROOT_URL = environment.rootURL + '/api/v1/annotated-files/';

  getAllAnnotatedFiles() {
    return this._http.get(this.ROOT_URL);
  }

  getSingleAnnotatedFile(id) {
    return this._http.get(this.ROOT_URL + id + '/');
  }

  addNewAnnotatedFile(data) {
    return this._http.post(this.ROOT_URL + 'add/', data);
  }

  deleteAnnotatedFile(id) {
    return this._http.delete(this.ROOT_URL + id + '/');
  }

  editAnnotatedFile(data, id) {
    return this._http.put(this.ROOT_URL + 'update/' + id + '/', data);
  }
}
