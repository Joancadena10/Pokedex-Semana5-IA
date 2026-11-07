import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  private http = inject(HttpClient);

  private apiUrl = 'https://pokeapi.co/api/v2';

  // SOLO LOS PRIMEROS 151
  getPokemonList() {
    return this.http.get<any>(
      `${this.apiUrl}/pokemon-species?limit=151&offset=0`
    );
  }

  getPokemon(idONombre: string) {
    return this.http.get<any>(
      `${this.apiUrl}/pokemon/${idONombre.toLowerCase()}`
    );
  }

  getTypes() {
    return this.http.get<any>(
      `${this.apiUrl}/type`
    );
  }

  getPokemonByType(type: string) {
    return this.http.get<any>(
      `${this.apiUrl}/type/${type}`
    );
  }

  getAbility(url: string) {
    return this.http.get<any>(url);
  }

  getMove(url: string) {
    return this.http.get<any>(url);
  }

}