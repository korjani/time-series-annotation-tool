import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private userSource = new BehaviorSubject(null);
  currentUser = this.userSource.asObservable();


  changeUser(user: any) {
    this.userSource.next(user);
  }
}
