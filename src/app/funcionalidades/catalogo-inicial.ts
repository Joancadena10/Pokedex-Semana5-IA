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

  // La misma definición controla validación, orden y tarjetas mostradas.
  const admitidos = [
    { id: 1, name: 'Bulbasaur' },
    { id: 4, name: 'Charmander' },
    { id: 7, name: 'Squirtle' },
  ] as const;

  return admitidos.map(({ id, name }) => {
    const registro = registros.find((item) => {
      if (typeof item?.url !== 'string') {
        return false;
      }
      const identificador = item.url.match(/\/pokemon-species\/(\d+)\/?$/)?.[1];
      return Number(identificador) === id;
    });

    if (typeof registro?.name !== 'string' || registro.name.toLowerCase() !== name.toLowerCase()) {
      throw new Error('Datos no disponibles');
    }

    return {
      id,
      name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });
}
