import { Component } from '@angular/core';
import { CharactersService } from 'src/services/characters.service';
import { EpisodesService } from 'src/services/episodes.service';
import { LocationsService } from 'src/services/locations.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chipax-challenge';
  resultados: Array<string>;
  segundosRespuesta: number;

  constructor(
    private servicioCharacters: CharactersService,
    private servicioLocations: LocationsService,
    private servicioEpisodes: EpisodesService
  ) {
    this.resultados = [];
  }

  private async encontrarLesEnLocations(): Promise<void> {
    let t0 = performance.now()
    var filtro = "l";
    this.servicioLocations.getLocationsFilteredByName(filtro).then(res => {
      var locations = [];
      var conteoIes = 0;
      res.forEach(resultado => { locations = locations.concat(resultado.results); });
      locations.forEach(location => { 
        conteoIes = conteoIes + this.contarCaracteres(location.name, filtro);
      });
      
      let t1 = performance.now();
      this.resultados.push("Se encontró la letra '" + filtro + "' " +  conteoIes + " veces en los " + locations.length +  " locations que la contenian. Duración: " + (t1 - t0).toFixed(2) + "ms");
    });
  }

  private async encontrarEesEnEpisodes(): Promise<void> {
    let t0 = performance.now();
    var filtro = "e";
    this.servicioEpisodes.getEpisodesFilteredByName(filtro).then(res => {
      var episodes = [];
      var conteoEes = 0;
      res.forEach(resultado => { episodes = episodes.concat(resultado.results); });
      episodes.forEach(location => { 
        conteoEes = conteoEes + this.contarCaracteres(location.name, filtro);
      });
      let t1 = performance.now();
      this.resultados.push("Se encontró la letra '" + filtro + "' " +  conteoEes + " veces en los " + episodes.length +  " episodes que la contenian. Duración: " + (t1 - t0).toFixed(2) + "ms");
    });
  }

  private async encontrarCesEnCharacters(): Promise<void> {
    let t0 = performance.now()
    var filtro = "c";
    this.servicioCharacters.getCharactersFilteredByName(filtro).then(res => {
      var characters = [];
      var conteoEes = 0;
      res.forEach(resultado => { characters = characters.concat(resultado.results); });
      characters.forEach(location => { 
        conteoEes = conteoEes + this.contarCaracteres(location.name, filtro);
      });
      let t1 = performance.now();
      this.resultados.push("Se encontró la letra '" + filtro + "' " +  conteoEes + " veces en los " + characters.length +  " characters que la contenian. Duración: " + (t1 - t0).toFixed(2) + "ms");
    });
  }

  public procesar() : void {
    this.resultados = [];
    this.encontrarLesEnLocations();
    this.encontrarEesEnEpisodes();
    this.encontrarCesEnCharacters();
  }

  private contarCaracteres(texto: string, caracter: string) {
    var conteo = 0;
    for (let i=0; i<texto.length; i++) {
      if (texto[i].toUpperCase() == caracter.toUpperCase())
        conteo++
    }
    return conteo;
  }
}
