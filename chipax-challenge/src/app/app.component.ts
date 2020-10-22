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
  resultadosPrimeraPregunta: Array<string>;
  resultadosSegundaPregunta: any;
  segundosRespuesta: number;

  constructor(
    private servicioCharacters: CharactersService,
    private servicioLocations: LocationsService,
    private servicioEpisodes: EpisodesService
  ) {
    this.resultadosPrimeraPregunta = [];
    this.segundosRespuesta = 0;
  }

  public procesarPregunta1(): void {
    this.resultadosPrimeraPregunta = [];
    this.encontrarLesEnLocations();
    this.encontrarEesEnEpisodes();
    this.encontrarCesEnCharacters();
  }

  public procesarPregunta2(): void {
    this.encontrarLocationsPorEpisode();
  }

  /* Metodos Pregunta 1 */
  // Encuenta L en Locations
  private async encontrarLesEnLocations(): Promise<void> {
    let t0 = performance.now()
    var filtro = "l";

    //se obtienen solo aquellos locations que cumplen con tener la letra en su nombre
    this.servicioLocations.getLocationsFilteredByName(filtro).then(res => {
      var locations = [];
      var conteoIes = 0;
      //obtengo los locations de todas los GET's a cada una de las paginas
      res.forEach(resultado => { locations = locations.concat(resultado.results); });

      //cuento la aparicion de caracteres L en cada uno de los locations
      locations.forEach(location => {
        conteoIes = conteoIes + this.contarCaracteres(location.name, filtro);
      });

      let t1 = performance.now();
      this.resultadosPrimeraPregunta.push("Se encontró la letra '" + filtro + "' " + conteoIes + " veces en los " + locations.length + " locations que la contenian. Duración: " + (t1 - t0).toFixed(2) + "ms");
    });
  }

  // Encuenta E en Episodes
  private async encontrarEesEnEpisodes(): Promise<void> {
    let t0 = performance.now();
    var filtro = "e";

    //se obtienen solo episodes que cumplen con tener la letra en su nombre
    this.servicioEpisodes.getEpisodesFilteredByName(filtro).then(res => {
      var episodes = [];
      var conteoEes = 0;

      //obtengo los episodes de todas los GET's a cada una de las paginas
      res.forEach(resultado => { episodes = episodes.concat(resultado.results); });

      //cuento la aparicion de caracteres L en cada uno de los episodes
      episodes.forEach(location => {
        conteoEes = conteoEes + this.contarCaracteres(location.name, filtro);
      });

      let t1 = performance.now();
      this.resultadosPrimeraPregunta.push("Se encontró la letra '" + filtro + "' " + conteoEes + " veces en los " + episodes.length + " episodes que la contenian. Duración: " + (t1 - t0).toFixed(2) + "ms");
    });
  }

  // Encuenta C en Characters
  private async encontrarCesEnCharacters(): Promise<void> {
    let t0 = performance.now()
    var filtro = "c";

    //se obtienen solo aquellos characters que cumplen con tener la letra en su nombre
    this.servicioCharacters.getCharactersFilteredByName(filtro).then(res => {
      var characters = [];
      var conteoEes = 0;
      //obtengo los characters de todos los GET's a cada una de las paginas
      res.forEach(resultado => { characters = characters.concat(resultado.results); });
      
      //cuento la aparicion de caracteres L en cada uno de los characters
      characters.forEach(location => {
        conteoEes = conteoEes + this.contarCaracteres(location.name, filtro);
      });
      let t1 = performance.now();
      console.log(characters);
      this.resultadosPrimeraPregunta.push("Se encontró la letra '" + filtro + "' " + conteoEes + " veces en los " + characters.length + " characters que la contenian. Duración: " + (t1 - t0).toFixed(2) + "ms");
    });
  }

  // Cuenta de manera case insensitive cuantos caracteres existen dentro de un string
  private contarCaracteres(texto: string, caracter: string) {
    var conteo = 0;
    for (let i = 0; i < texto.length; i++) {
      if (texto[i].toUpperCase() == caracter.toUpperCase())
        conteo++
    }
    return conteo;
  }

  /* Metodos Pregunta 2 */
  private async encontrarLocationsPorEpisode(): Promise<void> {
    this.resultadosSegundaPregunta = [];
    let t0 = performance.now();

    this.servicioEpisodes.getAllEpisodes().then(res => {
      var episodes = [];
      res.forEach(resultado => {
        episodes = episodes.concat(resultado.results);
      });

      episodes.forEach((episode) => {
        //Obtenemos los Id's de los characters, obteniendo la URL de todos los characters del episodio
        //y luego le hacemos replace para quedarnos solo con su ID
        let idsCharacters = [];
        for (let c = 0; c < episode.characters.length; c++) {
          idsCharacters.push(episode.characters[c].replace("https://rickandmortyapi.com/api/character/", "") * 1)
        }

        //Se obtienen todos los characters del episodio de una sola pasada
        this.servicioCharacters.getCharactersById(idsCharacters).then((resCharacters) => {
          
          // se guardan todas las locations de origin de los characters
          let locations = [];
          for (let cha = 0; cha < resCharacters.length; cha++) {
            locations.push(resCharacters[cha].origin);
          }

          //se guarda el resultado en forma de tupla: episode, locations, locationsDistinct }
          this.resultadosSegundaPregunta.push({ episode: episode, locations: locations, locationsUnique: this.distinctLocations(locations) });
          
          //la ultima pasada parará el reloj
          let t1 = performance.now();
          this.segundosRespuesta = (t1-t0);
        });
      });
    });
  }

  //hace el distinct de un array de locations
  distinctLocations(locations: Array<any>): Array<any> {
    let locationsDistinct = [];
    locations.forEach(ele => {
      if (!locationsDistinct.find(l => l.url == ele.url)) {
        locationsDistinct.push(ele);
      }
    });
    return locationsDistinct;
  }
}
