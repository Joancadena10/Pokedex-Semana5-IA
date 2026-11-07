import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
  IonCardContent, IonButton, IonSpinner,
} from '@ionic/angular';
import { PokemonService } from '../../services/pokemon';
import { construirCatalogoInicial, PokemonInicial } from '../../funcionalidades/catalogo-inicial';

@Component({
  selector: 'app-iniciales',
  standalone: true,
  templateUrl: './iniciales.page.html',
  styleUrls: ['./iniciales.page.scss'],
  imports: [
    CommonModule, RouterLink, IonHeader, IonToolbar, IonTitle,
    IonContent, IonCard, IonCardContent, IonButton, IonSpinner,
  ],
})
export class InicialesPage implements OnInit {
  private readonly pokemonService = inject(PokemonService);

  pokemons: PokemonInicial[] = [];
  cargando = true;
  mensajeError = '';

  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe({
      next: (data: { results?: unknown }) => {
        try {
          this.pokemons = construirCatalogoInicial(
            data?.results as Parameters<typeof construirCatalogoInicial>[0],
          );
          this.mensajeError = '';
        } catch {
          this.pokemons = [];
          this.mensajeError = 'Datos no disponibles';
        } finally {
          this.cargando = false;
        }
      },
      error: () => {
        this.pokemons = [];
        this.mensajeError = 'Datos no disponibles';
        this.cargando = false;
      },
    });
  }
}
