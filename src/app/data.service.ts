import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  assignPerson(from, to, count) {
    if ((count > 0 && from.free >= count) ||
         (count < 0 && to.total >= count)) {
        to.total += count
        to.free  += count
        from.free -= count
    }
  }

  exploreSpeed = function(people) {
    return Math.sqrt(people) * 2.5
  }

  // Assumes that all weights add up to 100
  public SelectWeightedKey = function(weightMap) {

    var weight   = Math.random() * 100
    var toAddKey = ""

    for (let k in weightMap) {
        weight -= weightMap[k]
        if (weight <= 0) {
            toAddKey = k
            break
        }
    }

    return toAddKey
  }

  addArea = function(tier) {
    // Select a random area from the tier to add
    var toAddKey = this.SelectWeightedKey(this.areaMap[tier])
    var toAdd = cloneDeep(this.areas[tier][toAddKey])

    // Randomise resource
    for (let r of Object.keys(toAdd.resource)) {
        toAdd.resource[r] = Math.ceil(Math.random() * toAdd.resource[r])
    }

    // Randomise duration/ticks (+/-0.5)
    toAdd.duration += Math.ceil((Math.random() - 0.5) * toAdd.duration)
    toAdd.ticks    += Math.ceil((Math.random() - 0.5) * toAdd.ticks)

    this.data.explore.areas.push(toAdd)
  }

  trySalvage = function(salvageMap) {
    // Select a random area from the tier to add
    var toAddKey = this.SelectWeightedKey(salvageMap)

    if (toAddKey != "") {
        var toAdd = cloneDeep(this.salvage[toAddKey])

        // Randomise resource
        for (let r of Object.keys(toAdd.resource)) {
            toAdd.resource[r] = Math.ceil(Math.random() * toAdd.resource[r])
        }

        // Randomise duration/ticks (+/-0.5)
        toAdd.duration += Math.ceil((Math.random() - 0.5) * toAdd.duration)
        toAdd.ticks    += Math.ceil((Math.random() - 0.5) * toAdd.ticks)

        this.data.salvage.objects.push(toAdd)
    }
  }

  /** Data */
  lastAreaKms = 0
  maxAreaKms  = 1

  data = {
        people: {
            total: 10,
            free:  10
        },
        explore: {
            resource: {
                people: {
                    total: 0
                }
            },
            progress: {
                current: 0,
                max:     242495
            },
            areas: [
            ]
        },
        salvage: {
            resource: {
                people: {
                    total: 0
                }
            },
            objects: [
            ]
        },
        resource: {
            food:     100,
            water:    100,
            currency: 0
        },
        overmind: {
            autoExplore: {
                people: {
                    total: 0,
                    free:  0
                }
            }
        },
        stats: {
            explored: {
                Garage: 0,
                House:  0
            }
        }
    }

    salvage = {
        car: {
            name: "Car",
            resource: {
                steel:     10,
                circuitry: 1
            },
            duration:      20,
            durationSpent: 0,
            ticks:         20,
            ticksSpent:    0
        }
    }

    // Each of the tier weights should add to 100
    areaMap = {
        1: {
        garage: 90,
        house:  10
        }
    }

    areas = {
        1: {
            garage: {
                name:     "Garage",
                resource: {
                    food:     10,
                    water:    10,
                    currency: 10
                },
                salvage: {
                    car: 99
                },
                duration:      5,
                durationSpent: 0,
                ticks:         3,
                ticksSpent:    0,
                people:        {
                    total:  0,
                    robots: 0
                }
            },
            house: {
                name:     "House",
                resource: {
                    food:     100,
                    water:    100,
                    currency: 100
                },
                duration:      10,
                durationSpent: 0,
                ticks:         10,
                ticksSpent:    0,
                people:        {
                    total:  0,
                    robots: 0
                }
            }
        }
    }
}
