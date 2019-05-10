import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  _actions: Subject<any>;

  constructor() { }

}
