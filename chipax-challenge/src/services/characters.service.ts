import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CharactersService {

    private _apiLocation = "https://rickandmortyapi.com/api/character";

    constructor(private http: HttpClient) { }

    /* Este metodo retorna una promesa que cuando se resuelva obtendrá los Characters 
    filtrados por el filtro entregado por parametros.  Al obtener la primera pagina 
    se retornan promesas del llamado GET para cada una de las paginas, de esta manera
    todos se obtienen todos los characters y no solo los 20 de la pagina actual.
    Para finalizar, se hace una promesa de todas las promesas anteriores y se retorna 
    a quien desee gatillarla.*/
    public getCharactersFilteredByName(filter: string) : Promise<any> {
        return new Promise((resolve) => {
            resolve(
                this.getCharactersFiltered(filter, 1).then(primerResultado => {
                    var paginas = primerResultado.info.pages;
                    let promesas : Array<Promise<any>> = [];
                    for (let i=1; i<=paginas; i++) {
                        promesas.push(this.getCharactersFiltered(filter, i));
                    }
                    return Promise.all(promesas);
                })
            );
        });
    }

    /*Obtiene los characters por un conjunto de id's esto nos evita tener que hacer
    un GET por cada ID */
    public getCharactersById(ids: Array<number>) : Promise<any> {
        return new Promise((resolve) => {
            resolve(
                this.getCharactersFilteredById(ids, 1)
            );
        });
    }

    private getCharactersFiltered(filterName: string, page: number) : Promise<any>{
        let url = this._apiLocation + "?name=" + filterName + "&page=" + page;
        return this.http.get(url).toPromise();
    }

    private getCharactersFilteredById(ids: Array<number>, page: number) : Promise<any> {
        let url = this._apiLocation + "/" + ids.join(",");
        return this.http.get(url).toPromise();
    }
}