import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private http = inject(HttpClient);

  private apiUrl = 'https://pokeapi.co/api/v2';

  getPokemonList(limit: number = 151, offset: number = 0) {
    return this.http.get<any>(
      `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  getPokemon(name: string) {
    return this.http.get<any>(
      `${this.apiUrl}/pokemon/${name}`
    );
  }
}