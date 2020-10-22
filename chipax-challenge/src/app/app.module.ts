import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { CharactersService } from 'src/services/characters.service';
import { LocationsService } from 'src/services/locations.service';
import { EpisodesService } from 'src/services/episodes.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    CharactersService,
    LocationsService,
    EpisodesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
