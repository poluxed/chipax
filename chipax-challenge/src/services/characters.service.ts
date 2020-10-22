import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CharactersService {

    private _apiLocation = "https://rickandmortyapi.com/api/character";

    constructor(private http: HttpClient) { }

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

    private getCharactersFiltered(filterName: string, page: number) : Promise<any>{
        let url = this._apiLocation + "?name=" + filterName + "&page=" + page;
        return this.http.get(url).toPromise();
    }
}