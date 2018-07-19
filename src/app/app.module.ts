import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ResourceComponent } from './resource/resource.component';
import { KeysPipe } from './keys.pipe';
import { ExploreComponent } from './explore/explore.component';
import { StoryComponent } from './story/story.component';
import { SalvageComponent } from './salvage/salvage.component';

@NgModule({
  declarations: [
    AppComponent,
    ResourceComponent,
    KeysPipe,
    ExploreComponent,
    StoryComponent,
    SalvageComponent,
  ],
  imports: [
      BrowserModule,
      NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
