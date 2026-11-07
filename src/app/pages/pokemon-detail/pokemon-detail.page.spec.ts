import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { PokemonDetailPage } from './pokemon-detail.page';

describe('PokemonDetailPage', () => {
  it('se puede crear con sus dependencias de enrutamiento', async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonDetailPage],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();

    const fixture = TestBed.createComponent(PokemonDetailPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
