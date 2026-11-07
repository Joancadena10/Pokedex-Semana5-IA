import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'inicio',
    loadComponent: () => import('./pages/iniciales/iniciales.page').then(m => m.InicialesPage)
  },

  {
    path: 'home',

    loadComponent: () =>
      import(
        './home/home.page'
      )
      .then(
        m => m.HomePage
      )
  },

  {
    path: 'pokemon/:name',

    loadComponent: () =>
      import(
        './pages/pokemon-detail/pokemon-detail.page'
      )
      .then(
        m => m.PokemonDetailPage
      )
  },

  {
    path: '',

    redirectTo: 'inicio',

    pathMatch: 'full'
  }

];