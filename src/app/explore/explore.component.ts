import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  constructor(public  dataService:  DataService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  open(content, loot) {
    this.loot = loot
    // No matter how the modal is closed, claim the loot
    this.modalService.open(content, {ariaLabelledBy: 'loot-modal'})
                     .result.then((result) => {
                       this.dataService.claimLoot(loot);
                     }, (dismissed) => {
                       this.dataService.claimLoot(loot);
                     })

  }
}
