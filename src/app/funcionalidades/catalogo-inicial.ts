/** Registro recibido del catálogo de especies de PokeAPI. */
export interface RegistroPokemon {
  name?: string | null;
  url?: string | null;
}

/** Información necesaria para mostrar la tarjeta en la pantalla inicial. */
export interface PokemonInicial {
  id: number;
  name: string;
  image: string;
}

/**
 * HU-01. Devuelve únicamente los tres Pokémon admitidos: 1, 4 y 7.
 * No modifica el catálogo de entrada. Si alguno no tiene datos válidos,
 * rechaza el catálogo completo para evitar tarjetas incompletas.
 */
export function construirCatalogoInicial(registros: readonly RegistroPokemon[]): PokemonInicial[] {
  if (!Array.isArray(registros)) {
    throw new Error('Datos no disponibles');
  }

  const bulbasaur = registros.find((registro) =>
    typeof registro?.url === 'string' && /\/pokemon-species\/1\/?$/.test(registro.url));
  const charmander = registros.find((registro) =>
    typeof registro?.url === 'string' && /\/pokemon-species\/4\/?$/.test(registro.url));
  const squirtle = registros.find((registro) =>
    typeof registro?.url === 'string' && /\/pokemon-species\/7\/?$/.test(registro.url));

  if (
    bulbasaur?.name?.toLowerCase() !== 'bulbasaur' ||
    charmander?.name?.toLowerCase() !== 'charmander' ||
    squirtle?.name?.toLowerCase() !== 'squirtle'
  ) {
    throw new Error('Datos no disponibles');
  }

  return [
    {
      id: 1,
      name: 'Bulbasaur',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    },
    {
      id: 4,
      name: 'Charmander',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    },
    {
      id: 7,
      name: 'Squirtle',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    },
  ];
}
