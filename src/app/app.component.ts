import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title       = 'Angular App Test';

  constructor(private dataService: DataService) {
  }

  UiUpdate(dataService) {
    var tps = 1/100;
    var tickScale = 1/6000; // Tick every 10ms, and 1 second = 1 minutes

    var moreExplored =
           dataService.exploreSpeed(dataService.data.explore.resource.people.total) * tickScale;

    dataService.lastAreaKms += moreExplored

    // Explore
    dataService.data.explore.areas.forEach(
        function(area, index) {
            area.durationSpent += (area.people.total + area.people.robots) * tps

            if (area.durationSpent > area.duration) {
                area.durationSpent = 0
                area.ticksSpent += 1

                dataService.data.resource.food     += area.resource.food
                dataService.data.resource.water    += area.resource.water
                dataService.data.resource.currency += area.resource.currency

                dataService.trySalvage(area.salvage)

                if (area.ticksSpent > area.ticks) {
                    // Finished - remove all assigned people, robots, and
                    // the area
                    dataService.data.people.free                      += area.people.total
                    dataService.data.overmind.autoExplore.people.free += area.people.robots
                    dataService.data.explore.areas.splice(index, 1)
                    dataService.data.stats.explored[area.name]++
                }
            }
        });

    //More people explore faster, with diminishing returns
    dataService.data.explore.progress.current += moreExplored

    // Salvage
    Object.keys(dataService.data.salvage).forEach(
        function(k, index) {
            var obj = dataService.data.salvage[k]

            if (obj.count > 0 && obj.people.total > 0) {
                obj.durationSpent += (obj.people.total + obj.people.robots) * tps

                if (obj.durationSpent > obj.duration) {
                    obj.count--
                    obj.durationSpent = 0
                    obj.duration      = obj.baseDuration +
                                        (obj.baseDuration * (Math.random() - 0.5))

                    if (obj.count == 0) {
                        dataService.data.people.free += obj.people.total
                        obj.people.total              = 0
                    }

                    for (let k of Object.keys(obj.resource)) {
                        dataService.data.resource[k] += obj.resource[k]
                    }
                }
            }
        });

    // Build
    dataService.data.recipes.forEach(
        function(recipe, index) {

            if (recipe.queued > 0 && recipe.people.total > 0) {
                recipe.durationSpent += (recipe.people.total + recipe.people.robots) * tps

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

    // If there are free exploring robots, assign them
    var unexplored = dataService.data.explore.areas.some(
        function(area) {
            return (area.people.total + area.people.robots) == 0;
        });

    dataService.data.explore.areas.some(
        function(area) {
        /** If we're only assigning to unexplored, then skip in progress areas */
            if ((unexplored == ((area.people.total + area.people.robots) == 0)) &&
                dataService.data.overmind.autoExplore.people.free > 0) {

                area.people.robots++
                dataService.data.overmind.autoExplore.people.free--
            }

            return dataService.data.overmind.autoExplore.people.free == 0
        });

    var workers = dataService.data.people.total - dataService.data.people.free

    dataService.data.resource.food  -= workers
    dataService.data.resource.water -= workers
  };


  ngOnInit() {
      setInterval(this.UiUpdate, 10, this.dataService);
      setInterval(this.EventTrigger, 1000, this.dataService);
  }
}
