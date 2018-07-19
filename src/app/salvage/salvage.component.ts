import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-salvage',
  templateUrl: './salvage.component.html',
  styleUrls: ['./salvage.component.css']
})
export class SalvageComponent implements OnInit {

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
  }

}
