import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  story = [
      "You awaken lying on the street.",
      "Last thing you remember are the bombs falling. Fire and noise.",
      "You get up. Looks like your legs still work. That's good. You also have a\
       little food and water, but not enough to last. Some more certainly\
       wouldn't hurt.",
      "Everything around you looks exhausted, and you have no idea where you are.",
      "Oh well, better start exploring."
  ]

  constructor() { }

  ngOnInit() {
  }

}
