import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonSpinner,
  IonButton,
  AlertController
} from '@ionic/angular';


@Component({
  selector: 'app-pokemon-detail',

  templateUrl:
    './pokemon-detail.page.html',

  styleUrls: [
    './pokemon-detail.page.scss'
  ],

  imports: [
    CommonModule,
    RouterLink,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonChip,
    IonSpinner,
    IonButton
  ]
})
export class PokemonDetailPage implements OnInit {

  pokemon: any = null;

  cargando = true;

  error = false;

  esPersonalizado = false;

  imagenPersonalizada = '';

  generacion = 1;


  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {

    const identificador =
      this.route.snapshot
        .paramMap
        .get('name');


    if (!identificador) {

      this.cargando = false;

      this.error = true;

      return;

    }


    if (
      identificador.startsWith(
        'local-'
      )
    ) {

      const id =
        Number(
          identificador.replace(
            'local-',
            ''
          )
        );


      this.cargarPersonalizado(
        id
      );

      return;

    }


    this.cargarOriginal(
      identificador
    );

  }


  // ===================================
  // PERSONALIZADO
  // ===================================

  cargarPersonalizado(
    id: number
  ) {

    try {

      const datos =
        localStorage.getItem(
          'pokemonsPersonalizados'
        );


      const lista =
        datos
          ? JSON.parse(datos)
          : [];


      const encontrado =
        lista.find(
          (pokemon: any) =>
            Number(pokemon.id)
            ===
            id
        );


      if (!encontrado) {

        this.error = true;

        return;

      }


      this.esPersonalizado =
        true;


      this.generacion =
        encontrado.generation;


      this.imagenPersonalizada =
        encontrado.image;


      this.pokemon = {

        id:
          encontrado.id,

        name:
          encontrado.name,

        types: [

          {
            type: {
              name:
                encontrado.type
            }
          }

        ],

        stats: [

          {
            base_stat:
              encontrado.hp,

            stat: {
              name: 'hp'
            }
          },

          {
            base_stat:
              encontrado.attack,

            stat: {
              name: 'attack'
            }
          },

          {
            base_stat:
              encontrado.defense,

            stat: {
              name: 'defense'
            }
          },

          {
            base_stat:
              encontrado.specialAttack,

            stat: {
              name:
                'special-attack'
            }
          },

          {
            base_stat:
              encontrado.specialDefense,

            stat: {
              name:
                'special-defense'
            }
          },

          {
            base_stat:
              encontrado.speed,

            stat: {
              name: 'speed'
            }
          }

        ],

        abilities: [],

        moves: []

      };


    } catch (error) {

      console.error(
        error
      );

      this.error = true;

    } finally {

      this.cargando = false;

      this.cdr.detectChanges();

    }

  }


  // ===================================
  // ORIGINAL POKEAPI
  // ===================================

  async cargarOriginal(
    identificador: string
  ) {

    this.cargando = true;

    this.error = false;


    const controlador =
      new AbortController();


    const tiempo =
      setTimeout(
        () =>
          controlador.abort(),
        10000
      );


    try {

      const respuesta =
        await fetch(

          `https://pokeapi.co/api/v2/pokemon/${identificador}`,

          {
            signal:
              controlador.signal
          }

        );


      if (!respuesta.ok) {

        throw new Error(
          `HTTP ${respuesta.status}`
        );

      }


      const data =
        await respuesta.json();


      this.pokemon =
        this.aplicarEdicionLocal(
          data
        );


      this.esPersonalizado =
        false;


    } catch (error) {

      console.error(
        'Error:',
        error
      );

      this.error = true;


    } finally {

      clearTimeout(
        tiempo
      );


      this.cargando = false;

      this.cdr.detectChanges();

    }

  }


  // ===================================
  // APLICAR MODIFICACIÓN LOCAL
  // ===================================

  aplicarEdicionLocal(
    data: any
  ) {

    try {

      const datos =
        localStorage.getItem(
          'pokemonsEditados'
        );


      const lista =
        datos
          ? JSON.parse(datos)
          : [];


      const editado =
        lista.find(
          (pokemon: any) =>
            Number(pokemon.id)
            ===
            Number(data.id)
        );


      if (!editado) {

        return data;

      }


      data.name =
        editado.name;


      this.imagenPersonalizada =
        editado.image;


      this.generacion =
        editado.generation;


      data.types = [

        {
          type: {
            name:
              editado.type
          }
        }

      ];


      const valores: any = {

        hp:
          editado.hp,

        attack:
          editado.attack,

        defense:
          editado.defense,

        'special-attack':
          editado.specialAttack,

        'special-defense':
          editado.specialDefense,

        speed:
          editado.speed

      };


      data.stats =
        data.stats.map(
          (stat: any) => ({

            ...stat,

            base_stat:
              valores[
                stat.stat.name
              ]
              ??
              stat.base_stat

          })
        );


      return data;


    } catch {

      return data;

    }

  }


  imagenPokemon(): string {

    if (
      this.imagenPersonalizada
    ) {

      return this.imagenPersonalizada;

    }


    return (

      this.pokemon
        ?.sprites
        ?.other
        ?.['official-artwork']
        ?.front_default

      ||

      this.pokemon
        ?.sprites
        ?.front_default

      ||

      ''

    );

  }


  numeroPokemon(): string {

    if (!this.pokemon) {

      return '';

    }


    return '#' +
      this.pokemon.id
        .toString()
        .padStart(
          3,
          '0'
        );

  }


  nombreStat(
    nombre: string
  ): string {

    const nombres: any = {

      hp:
        'PS',

      attack:
        'Ataque',

      defense:
        'Defensa',

      'special-attack':
        'Ataque Especial',

      'special-defense':
        'Defensa Especial',

      speed:
        'Velocidad'

    };


    return (
      nombres[nombre]
      ||
      nombre
    );

  }


  porcentajeStat(
    valor: number
  ): number {

    return Math.min(
      (valor / 180) * 100,
      100
    );

  }


  // ===================================
  // HABILIDAD
  // ===================================

  async verHabilidad(
    habilidad: any
  ) {

    try {

      const respuesta =
        await fetch(
          habilidad.ability.url
        );


      const data =
        await respuesta.json();


      const descripcion =
        this.obtenerDescripcion(
          data
        );


      const alert =
        await this.alertController
          .create({

            header:
              this.capitalizar(
                habilidad
                  .ability
                  .name
              ),

            subHeader:
              'Habilidad',

            message:
              descripcion,

            buttons: [
              'Cerrar'
            ]

          });


      await alert.present();


    } catch {

      console.error(
        'Error habilidad'
      );

    }

  }


  // ===================================
  // MOVIMIENTO
  // ===================================

  async verMovimiento(
    movimiento: any
  ) {

    try {

      const respuesta =
        await fetch(
          movimiento.move.url
        );


      const data =
        await respuesta.json();


      const descripcion =
        this.obtenerDescripcion(
          data
        );


      const alert =
        await this.alertController
          .create({

            header:
              this.capitalizar(
                movimiento
                  .move
                  .name
              ),

            subHeader:
              'Movimiento',

            message:
              descripcion,

            buttons: [
              'Cerrar'
            ]

          });


      await alert.present();


    } catch {

      console.error(
        'Error movimiento'
      );

    }

  }


  obtenerDescripcion(
    data: any
  ): string {

    const textos =
      data.flavor_text_entries
      || [];


    const español =
      textos.find(
        (texto: any) =>
          texto.language.name
          ===
          'es'
      );


    const ingles =
      textos.find(
        (texto: any) =>
          texto.language.name
          ===
          'en'
      );


    return (

      español?.flavor_text

      ||

      ingles?.flavor_text

      ||

      'Sin descripción disponible.'

    )
      .replace(
        /\n/g,
        ' '
      )
      .replace(
        /\f/g,
        ' '
      );

  }


  capitalizar(
    texto: string
  ): string {

    return texto

      ?.replace(
        /-/g,
        ' '
      )

      .replace(
        /\b\w/g,
        letra =>
          letra.toUpperCase()
      )

      || '';

  }

}