import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.css']
})
export class BuildComponent implements OnInit {

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
  }

  queue = function (recipe)
  {
      recipe.queued++

      for (let k of Object.keys(recipe.ingredients)) {
          dataService.data.resource[k] -= recipe.ingredients[k]
      }
  }

  haveResources = function(toCheck) {
      var ret = true

      for (let k of Object.keys(toCheck)) {
          if (dataService.data.resource[k] < toCheck[k]) {
              ret = false
              break
          }
      }

      return ret
  }

}
