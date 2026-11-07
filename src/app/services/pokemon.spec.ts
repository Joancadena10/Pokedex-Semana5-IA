import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonService } from './pokemon';

describe('PokemonService', () => {
  it('se puede crear con el cliente HTTP configurado', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    expect(TestBed.inject(PokemonService)).toBeTruthy();
  });
});
