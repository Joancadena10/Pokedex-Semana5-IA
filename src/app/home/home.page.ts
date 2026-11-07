import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonInput
} from '@ionic/angular';

import { PokemonService } from '../services/pokemon';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonSpinner,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonInput
  ]
})
export class HomePage implements OnInit {

  // 151 Pokémon originales
  pokemonsBase: any[] = [];

  // Pokémon creados manualmente
  pokemonsPersonalizados: any[] = [];

  // IDs de originales eliminados
  pokemonsEliminados: number[] = [];

  // Modificaciones hechas a originales
  pokemonsEditados: any[] = [];

  // Pokémon visibles
  pokemonsFiltrados: any[] = [];

  tipos: any[] = [];

  textoBusqueda = '';

  tipoSeleccionado = '';

  generacionSeleccionada = '';

  filtroTipo: Set<string> | null = null;

  cargando = true;

  mostrarFormulario = false;

  modoEdicion = false;

  pokemonEditandoId: number | null = null;

  pokemonEditandoPersonalizado = false;

  mensajeFormulario = '';


  nuevoPokemon: any = {
    name: '',
    image: '',
    type: 'normal',
    generation: 1,

    hp: 50,
    attack: 50,
    defense: 50,
    specialAttack: 50,
    specialDefense: 50,
    speed: 50
  };


  generaciones = [
    { id: 1, nombre: 'Generación I' },
    { id: 2, nombre: 'Generación II' },
    { id: 3, nombre: 'Generación III' },
    { id: 4, nombre: 'Generación IV' },
    { id: 5, nombre: 'Generación V' },
    { id: 6, nombre: 'Generación VI' },
    { id: 7, nombre: 'Generación VII' },
    { id: 8, nombre: 'Generación VIII' },
    { id: 9, nombre: 'Generación IX' }
  ];


  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}


  ngOnInit() {

    this.cargarEliminados();

    this.cargarPersonalizados();

    this.cargarEditados();

    this.cargarPokemons();

    this.cargarTipos();

  }


  // =========================================
  // CARGAR 151 POKÉMON
  // =========================================

  cargarPokemons() {

    this.cargando = true;

    this.pokemonService
      .getPokemonList()
      .subscribe({

        next: (data: any) => {

          this.pokemonsBase =
            data.results.map(
              (pokemon: any) => {

                const id =
                  this.obtenerId(
                    pokemon.url
                  );

                const base = {

                  id: id,

                  name:
                    pokemon.name,

                  image:
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,

                  generation: 1,

                  personalizado: false,

                  editado: false

                };


                const modificacion =
                  this.pokemonsEditados.find(
                    item =>
                      item.id === id
                  );


                if (modificacion) {

                  return {

                    ...base,

                    ...modificacion,

                    id: id,

                    personalizado: false,

                    editado: true

                  };

                }


                return base;

              }
            );


          // No mostrar los eliminados
          this.pokemonsBase =
            this.pokemonsBase.filter(
              pokemon =>
                !this.pokemonsEliminados.includes(
                  pokemon.id
                )
            );


          this.aplicarFiltros();

          this.cargando = false;

        },


        error: (error: any) => {

          console.error(
            'Error cargando Pokémon:',
            error
          );

          this.cargando = false;

        }

      });

  }


  // =========================================
  // TIPOS
  // =========================================

  cargarTipos() {

    this.pokemonService
      .getTypes()
      .subscribe({

        next: (data: any) => {

          this.tipos =
            data.results.filter(
              (tipo: any) =>
                tipo.name !== 'unknown' &&
                tipo.name !== 'stellar'
            );

        },

        error: (error: any) => {

          console.error(
            'Error cargando tipos:',
            error
          );

        }

      });

  }


  obtenerId(url: string): number {

    const partes =
      url
        .split('/')
        .filter(parte => parte);

    return Number(
      partes[
        partes.length - 1
      ]
    );

  }


  // =========================================
  // BUSCADOR
  // =========================================

  buscarPokemon(event: any) {

    this.textoBusqueda =
      event.detail.value
        ?.toLowerCase()
        .trim() || '';

    this.aplicarFiltros();

  }


  // =========================================
  // FILTRO TIPO
  // =========================================

  filtrarTipo(event: any) {

    const tipo =
      event.detail.value;

    this.tipoSeleccionado =
      tipo;


    if (!tipo) {

      this.filtroTipo = null;

      this.aplicarFiltros();

      return;

    }


    this.pokemonService
      .getPokemonByType(tipo)
      .subscribe({

        next: (data: any) => {

          const nombres =
            data.pokemon.map(
              (item: any) =>
                item.pokemon.name
            );

          this.filtroTipo =
            new Set(nombres);

          this.aplicarFiltros();

        },

        error: (error: any) => {

          console.error(
            'Error filtrando tipo:',
            error
          );

        }

      });

  }


  // =========================================
  // GENERACIÓN
  // =========================================

  filtrarGeneracion(event: any) {

    this.generacionSeleccionada =
      event.detail.value;

    this.aplicarFiltros();

  }


  // =========================================
  // APLICAR FILTROS
  // =========================================

  aplicarFiltros() {

    let resultado = [

      ...this.pokemonsBase,

      ...this.pokemonsPersonalizados

    ];


    const texto =
      this.textoBusqueda
        .replace('#', '')
        .toLowerCase();


    // NOMBRE O ID
    if (texto) {

      resultado =
        resultado.filter(
          pokemon =>

            pokemon.name
              .toLowerCase()
              .includes(texto)

            ||

            pokemon.id
              .toString()
              .includes(texto)
        );

    }


    // TIPO
    if (this.tipoSeleccionado) {

      resultado =
        resultado.filter(
          pokemon => {

            // Personalizados y originales editados
            if (
              pokemon.personalizado ||
              pokemon.editado
            ) {

              return (
                pokemon.type ===
                this.tipoSeleccionado
              );

            }


            // Original sin editar
            return (
              this.filtroTipo
                ?.has(pokemon.name)
              ?? false
            );

          }
        );

    }


    // GENERACIÓN
    if (this.generacionSeleccionada) {

      const generacion =
        Number(
          this.generacionSeleccionada
        );


      resultado =
        resultado.filter(
          pokemon =>
            Number(
              pokemon.generation
            )
            ===
            generacion
        );

    }


    this.pokemonsFiltrados =
      resultado;

  }


  limpiarFiltros() {

    this.textoBusqueda = '';

    this.tipoSeleccionado = '';

    this.generacionSeleccionada = '';

    this.filtroTipo = null;

    this.aplicarFiltros();

  }


  // =========================================
  // ABRIR FORMULARIO NUEVO
  // =========================================

  abrirFormularioNuevo() {

    this.modoEdicion = false;

    this.pokemonEditandoId = null;

    this.pokemonEditandoPersonalizado =
      false;

    this.mensajeFormulario = '';

    this.nuevoPokemon = {

      name: '',

      image: '',

      type: 'normal',

      generation: 1,

      hp: 50,

      attack: 50,

      defense: 50,

      specialAttack: 50,

      specialDefense: 50,

      speed: 50

    };

    this.mostrarFormulario = true;

  }


  cancelarFormulario() {

    this.mostrarFormulario = false;

    this.modoEdicion = false;

    this.pokemonEditandoId = null;

    this.mensajeFormulario = '';

  }


  // =========================================
  // EDITAR
  // =========================================

  editarPokemon(
    pokemon: any,
    event: Event
  ) {

    event.stopPropagation();

    this.mensajeFormulario = '';

    this.modoEdicion = true;

    this.pokemonEditandoId =
      pokemon.id;

    this.pokemonEditandoPersonalizado =
      pokemon.personalizado;


    // Ya tenemos estadísticas locales
    if (
      pokemon.personalizado ||
      pokemon.editado
    ) {

      this.cargarDatosFormulario(
        pokemon
      );

      return;

    }


    // Pokémon original:
    // traemos sus estadísticas
    this.pokemonService
      .getPokemon(
        pokemon.id.toString()
      )
      .subscribe({

        next: (data: any) => {

          const stats =
            this.extraerEstadisticas(
              data
            );


          this.nuevoPokemon = {

            name:
              pokemon.name,

            image:
              pokemon.image,

            type:
              data.types[0]
                ?.type
                ?.name
              || 'normal',

            generation:
              1,

            hp:
              stats.hp,

            attack:
              stats.attack,

            defense:
              stats.defense,

            specialAttack:
              stats.specialAttack,

            specialDefense:
              stats.specialDefense,

            speed:
              stats.speed

          };


          this.mostrarFormulario =
            true;

        },


        error: (error: any) => {

          console.error(
            'Error cargando datos:',
            error
          );

        }

      });

  }


  cargarDatosFormulario(
    pokemon: any
  ) {

    this.nuevoPokemon = {

      name:
        pokemon.name,

      image:
        pokemon.image,

      type:
        pokemon.type || 'normal',

      generation:
        pokemon.generation || 1,

      hp:
        pokemon.hp ?? 50,

      attack:
        pokemon.attack ?? 50,

      defense:
        pokemon.defense ?? 50,

      specialAttack:
        pokemon.specialAttack ?? 50,

      specialDefense:
        pokemon.specialDefense ?? 50,

      speed:
        pokemon.speed ?? 50

    };


    this.mostrarFormulario =
      true;

  }


  // =========================================
  // GUARDAR CREAR / EDITAR
  // =========================================

  guardarPokemon() {

    this.mensajeFormulario = '';


    const nombre =
      this.nuevoPokemon.name
        ?.trim()
        .toLowerCase();


    if (!nombre) {

      this.mensajeFormulario =
        'Debes escribir el nombre.';

      return;

    }


    const estadisticas = [

      this.nuevoPokemon.hp,

      this.nuevoPokemon.attack,

      this.nuevoPokemon.defense,

      this.nuevoPokemon.specialAttack,

      this.nuevoPokemon.specialDefense,

      this.nuevoPokemon.speed

    ];


    const estadisticasInvalidas =
      estadisticas.some(
        valor =>
          valor === '' ||
          valor === null ||
          isNaN(Number(valor)) ||
          Number(valor) < 0
      );


    if (estadisticasInvalidas) {

      this.mensajeFormulario =
        'Todas las estadísticas deben ser números válidos.';

      return;

    }


    const todos = [

      ...this.pokemonsBase,

      ...this.pokemonsPersonalizados

    ];


    const duplicado =
      todos.some(
        pokemon =>

          pokemon.name
            .toLowerCase()
          ===
          nombre

          &&

          pokemon.id
          !==
          this.pokemonEditandoId
      );


    if (duplicado) {

      this.mensajeFormulario =
        'Ya existe un Pokémon con ese nombre.';

      return;

    }


    const imagen =

      this.nuevoPokemon.image
        ?.trim()

      ||

      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';


    const datos = {

      name:
        nombre,

      image:
        imagen,

      type:
        this.nuevoPokemon.type,

      generation:
        Number(
          this.nuevoPokemon.generation
        ),

      hp:
        Number(
          this.nuevoPokemon.hp
        ),

      attack:
        Number(
          this.nuevoPokemon.attack
        ),

      defense:
        Number(
          this.nuevoPokemon.defense
        ),

      specialAttack:
        Number(
          this.nuevoPokemon.specialAttack
        ),

      specialDefense:
        Number(
          this.nuevoPokemon.specialDefense
        ),

      speed:
        Number(
          this.nuevoPokemon.speed
        )

    };


    // =========================
    // EDITAR
    // =========================

    if (
      this.modoEdicion &&
      this.pokemonEditandoId !== null
    ) {

      // PERSONALIZADO
      if (
        this.pokemonEditandoPersonalizado
      ) {

        this.pokemonsPersonalizados =
          this.pokemonsPersonalizados.map(
            pokemon =>

              pokemon.id ===
              this.pokemonEditandoId

              ?

              {
                ...pokemon,
                ...datos,
                personalizado: true
              }

              :

              pokemon
          );


        this.guardarPersonalizados();

      }


      // ORIGINAL
      else {

        const modificacion = {

          id:
            this.pokemonEditandoId,

          ...datos,

          personalizado:
            false,

          editado:
            true

        };


        const indice =
          this.pokemonsEditados
            .findIndex(
              pokemon =>
                pokemon.id ===
                this.pokemonEditandoId
            );


        if (indice >= 0) {

          this.pokemonsEditados[
            indice
          ] = modificacion;

        } else {

          this.pokemonsEditados.push(
            modificacion
          );

        }


        this.guardarEditados();


        this.pokemonsBase =
          this.pokemonsBase.map(
            pokemon =>

              pokemon.id ===
              this.pokemonEditandoId

              ?

              {
                ...pokemon,
                ...modificacion
              }

              :

              pokemon
          );

      }

    }


    // =========================
    // CREAR
    // =========================

    else {

      const pokemon = {

        id:
          this.obtenerNuevoId(),

        ...datos,

        personalizado:
          true,

        editado:
          false

      };


      this.pokemonsPersonalizados.push(
        pokemon
      );


      this.guardarPersonalizados();

    }


    this.aplicarFiltros();

    this.cancelarFormulario();

  }


  // =========================================
  // ELIMINAR
  // =========================================

  eliminarPokemon(
    pokemon: any,
    event: Event
  ) {

    event.stopPropagation();


    const confirmar =
      window.confirm(

        `¿Seguro que deseas eliminar a ${this.capitalizar(pokemon.name)}?`

      );


    if (!confirmar) {

      return;

    }


    // PERSONALIZADO
    if (
      pokemon.personalizado
    ) {

      this.pokemonsPersonalizados =
        this.pokemonsPersonalizados.filter(
          item =>
            item.id !== pokemon.id
        );


      this.guardarPersonalizados();

    }


    // ORIGINAL
    else {

      if (
        !this.pokemonsEliminados.includes(
          pokemon.id
        )
      ) {

        this.pokemonsEliminados.push(
          pokemon.id
        );

      }


      this.pokemonsBase =
        this.pokemonsBase.filter(
          item =>
            item.id !== pokemon.id
        );


      this.guardarEliminados();

    }


    this.aplicarFiltros();

  }


  // =========================================
  // ABRIR DETALLE
  // =========================================

  abrirPokemon(
    pokemon: any
  ) {

    if (
      pokemon.personalizado
    ) {

      this.router.navigate([

        '/pokemon',

        `local-${pokemon.id}`

      ]);

      return;

    }


    // Para los originales usamos el ID
    this.router.navigate([

      '/pokemon',

      pokemon.id

    ]);

  }


  // =========================================
  // EXTRAER ESTADÍSTICAS POKEAPI
  // =========================================

  extraerEstadisticas(
    data: any
  ) {

    const obtener =
      (nombre: string) =>

        data.stats.find(
          (stat: any) =>
            stat.stat.name === nombre
        )
        ?.base_stat

        ?? 0;


    return {

      hp:
        obtener('hp'),

      attack:
        obtener('attack'),

      defense:
        obtener('defense'),

      specialAttack:
        obtener('special-attack'),

      specialDefense:
        obtener('special-defense'),

      speed:
        obtener('speed')

    };

  }


  // =========================================
  // ID NUEVO
  // =========================================

  obtenerNuevoId(): number {

    if (
      this.pokemonsPersonalizados.length
      ===
      0
    ) {

      return 152;

    }


    const ids =
      this.pokemonsPersonalizados.map(
        pokemon =>
          Number(pokemon.id)
      );


    return Math.max(
      ...ids,
      151
    ) + 1;

  }


  // =========================================
  // LOCAL STORAGE PERSONALIZADOS
  // =========================================

  guardarPersonalizados() {

    localStorage.setItem(

      'pokemonsPersonalizados',

      JSON.stringify(
        this.pokemonsPersonalizados
      )

    );

  }


  cargarPersonalizados() {

    try {

      const datos =
        localStorage.getItem(
          'pokemonsPersonalizados'
        );


      this.pokemonsPersonalizados =
        datos
          ? JSON.parse(datos)
          : [];

    } catch {

      this.pokemonsPersonalizados =
        [];

    }

  }


  // =========================================
  // LOCAL STORAGE ELIMINADOS
  // =========================================

  guardarEliminados() {

    localStorage.setItem(

      'pokemonsEliminados',

      JSON.stringify(
        this.pokemonsEliminados
      )

    );

  }


  cargarEliminados() {

    try {

      const datos =
        localStorage.getItem(
          'pokemonsEliminados'
        );


      this.pokemonsEliminados =
        datos
          ? JSON.parse(datos)
          : [];

    } catch {

      this.pokemonsEliminados =
        [];

    }

  }


  // =========================================
  // LOCAL STORAGE EDITADOS
  // =========================================

  guardarEditados() {

    localStorage.setItem(

      'pokemonsEditados',

      JSON.stringify(
        this.pokemonsEditados
      )

    );

  }


  cargarEditados() {

    try {

      const datos =
        localStorage.getItem(
          'pokemonsEditados'
        );


      this.pokemonsEditados =
        datos
          ? JSON.parse(datos)
          : [];

    } catch {

      this.pokemonsEditados =
        [];

    }

  }


  // =========================================
  // UTILIDADES
  // =========================================

  formatearNumero(
    id: number
  ): string {

    return '#' +
      id
        .toString()
        .padStart(
          3,
          '0'
        );

  }


  capitalizar(
    texto: string
  ): string {

    if (!texto) {

      return '';

    }

    return (

      texto.charAt(0)
        .toUpperCase()

      +

      texto.slice(1)

    );

  }

}