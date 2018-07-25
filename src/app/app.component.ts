import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title          = 'Angular App Test';
  timeSinceSave = 0

  constructor(public dataService: DataService) {
    this.Load(dataService)
  }

  UiUpdate(dataService) {
    var tps = 1/100;
    var tickScale = 1/6000; // Tick every 10ms, and 1 second = 1 minutes

    var moreExplored = dataService.exploreSpeed(
      dataService.data.explore.resource.people.total) * tickScale;

    dataService.lastAreaKms += moreExplored

    // Explore
    dataService.data.explore.areas.forEach(
      function(area, index) {

        if (area.durationSpent <= area.duration) {
          area.durationSpent += (area.people.total + area.people.robots) *
                                tps
        }

        if (area.durationSpent > area.duration) {
          if (area.ticksSpent < area.ticks) {
            area.durationSpent = 0
            area.ticksSpent += 1

            for (let k of Object.keys(area.resource)) {
              dataService.data.resource[k] += area.resource[k]
            }

            dataService.trySalvage(area.salvage)
          } else {
            if (!area.recipes || area.recipes.length == 0) {
              // Finished - remove all assigned people, robots, and
              // the area
              dataService.data.people.free                      +=
                                                          area.people.total
              dataService.data.overmind.explore.people.free +=
                                                          area.people.robots
              dataService.data.explore.areas.splice(index, 1)
              dataService.data.stats.explored[area.name]++
            } else {
              // The area is lootable, and will continue to show up until
              // looted
            }
          }
        }
      });

    //More people explore faster, with diminishing returns
    dataService.data.explore.progress.current += moreExplored

    // Salvage
    Object.keys(dataService.data.salvage).forEach(
      function(k, index) {
        var obj = dataService.data.salvage[k]

        if (obj.count > 0 &&
            (obj.people.total > 0 ||
             obj.people.robots > 0)) {
          obj.durationSpent += (obj.people.total + obj.people.robots) * tps

          if (obj.durationSpent > obj.duration) {
            obj.count--
            obj.durationSpent = 0
            obj.duration      = obj.baseDuration +
              (obj.baseDuration * (Math.random() - 0.5))

            if (obj.count == 0) {
              dataService.data.people.free                  +=
                obj.people.total
              dataService.data.overmind.salvage.people.free +=
                obj.people.robots
              obj.people.total                        = 0
            }

            for (let k of Object.keys(obj.resource)) {
              dataService.data.resource[k] += obj.resource[k]
            }

            dataService.data.stats.salvaged[k]++
          }
        }
      });

    // Build
    dataService.data.recipes.forEach(
      function(recipe, index) {

        if (recipe.queued > 0) {
          recipe.durationSpent += 1 * tps

          if (recipe.durationSpent > recipe.duration) {
            recipe.queued --
            recipe.durationSpent = 0

            dataService.data.overmind[recipe.job].people.free++
            dataService.data.overmind[recipe.job].people.total++

            // People aren't given back
            //if (recipe.queued == 0) {
            //    dataService.data.people.free += recipe.people.total
            //    recipe.people.total           = 0
            //}
          }
        }
      });
  };

  EventTrigger(dataService) {
    if (dataService.data.explore.resource.people.total > 0 &&
      dataService.lastAreaKms > Math.random() * dataService.maxAreaKms) {
      dataService.addArea(1)
      dataService.lastAreaKms = 0
    }

    dataService.addFixedEvent()

    // If there are free exploring robots, assign them
    var unexploredOnly = dataService.data.explore.new > 0

    dataService.data.explore.areas.some(
      function(area) {
        /** If we're only assigning to unexplored, then skip in progress
         * areas */
        var beingExplored = (area.people.total + area.people.robots) > 0
        if (unexploredOnly == !beingExplored &&
            dataService.data.overmind.explore.people.free > 0) {

          area.people.robots++
          dataService.data.overmind.explore.people.free--

          if (unexploredOnly) {
            dataService.data.explore.new--
          }
        }

        return dataService.data.overmind.explore.people.free == 0
      });

    // If there are free salvage robots, assign them
    // TODO - optimise this
    var unsalvagedOnly = Object.keys(dataService.data.salvage).some(
      function(k) {
        return (dataService.data.salvage[k].people.total +
                dataService.data.salvage[k].people.robots) == 0;
      });

    Object.keys(dataService.data.salvage).some(
      function(k) {
        /** If we're only assigning to unsalvaged, then skip in progress
         * areas */
        var beingSalvaged = (dataService.data.salvage[k].people.total +
                             dataService.data.salvage[k].people.robots) > 0;

        if (unsalvagedOnly == !beingSalvaged &&
            dataService.data.overmind.salvage.people.free > 0) {

          dataService.data.salvage[k].people.robots++
          dataService.data.overmind.salvage.people.free--
        }

        return dataService.data.overmind.salvage.people.free == 0
      });

    var workers = dataService.data.people.total -
                  dataService.data.people.free

    dataService.data.resource.food  -= workers
    dataService.data.resource.water -= workers
    dataService.timeSinceSave++
  };

  Save(dataService) {
    localStorage.setItem("data", JSON.stringify(dataService.data))
    dataService.timeSinceSave = 0
  }

  Load(dataService) {
    var jsonData = localStorage.getItem("data")

    if (jsonData) {
      dataService.data = JSON.parse(jsonData)
    }
  }

  ngOnInit() {
    setInterval(this.UiUpdate, 10, this.dataService);
    setInterval(this.EventTrigger, 1000, this.dataService);
    setInterval(this.Save, 10000, this.dataService);
  }
}
