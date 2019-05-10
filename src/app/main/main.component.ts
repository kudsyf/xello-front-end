import { Component, OnInit } from '@angular/core';
import { ActionsService } from 'src/services/actions.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private actions_services: ActionsService) {
    this.actions_services._actions = new Subject();


  }

  ngOnInit() {
  }

}
