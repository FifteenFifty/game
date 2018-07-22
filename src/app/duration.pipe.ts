import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(seconds: any, args?: any): any {
    var hours    = 0
    var minutes  = 0
    var toReturn = ""

    if (seconds > 3600) {
      hours = seconds % 3600
      seconds -= hours * 3600
      toReturn += hours + " hours"
    }
    if (seconds > 60) {
      minutes = seconds % 60
      seconds -= minutes * 60
      toReturn += (toReturn ? ", " : "")
               + minutes
               + (minutes > 1 ? " minutes" : " minute")
    }

    toReturn += (toReturn ? ", " : "")
             + seconds
             + (seconds > 1 ? " seconds" : " second")

    return toReturn;
  }
}
