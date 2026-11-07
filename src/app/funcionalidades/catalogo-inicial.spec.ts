import { construirCatalogoInicial } from './catalogo-inicial';

const pokemon = (id: number, name: string, sinBarraFinal = false) => ({
  name,
  url: `https://pokeapi.co/api/v2/pokemon-species/${id}${sinBarraFinal ? '' : '/'}`,
});

const bulbasaur = pokemon(1, 'bulbasaur');
const charmander = pokemon(4, 'charmander');
const squirtle = pokemon(7, 'squirtle');

describe('HU-01 - catálogo inicial de tres Pokémon', () => {
  it('muestra exactamente Bulbasaur, Charmander y Squirtle en ese orden', () => {
    const resultado = construirCatalogoInicial([bulbasaur, charmander, squirtle]);

    expect(resultado.map((item) => item.name)).toEqual([
      'Bulbasaur', 'Charmander', 'Squirtle',
    ]);
    expect(resultado.map((item) => item.id)).toEqual([1, 4, 7]);
    expect(resultado.every((item) => item.image.endsWith(`/${item.id}.png`))).toBe(true);
  });

  it('ignora otros Pokémon aunque el servicio devuelva más resultados', () => {
    const resultado = construirCatalogoInicial([
      pokemon(25, 'pikachu'), squirtle, pokemon(150, 'mewtwo'), bulbasaur, charmander,
    ]);

    expect(resultado).toHaveLength(3);
    expect(resultado.some((item) => item.name === 'Pikachu')).toBe(false);
  });

  it('funciona si los tres registros llegan desordenados y no modifica la entrada', () => {
    const entrada = [squirtle, bulbasaur, charmander];
    const copia = [...entrada];
    const resultado = construirCatalogoInicial(entrada);

    expect(resultado.map((item) => item.id)).toEqual([1, 4, 7]);
    expect(entrada).toEqual(copia);
  });

  it('acepta las URL de los identificadores límite sin barra final', () => {
    const resultado = construirCatalogoInicial([
      pokemon(1, 'bulbasaur', true), charmander, pokemon(7, 'squirtle', true),
    ]);

    expect(resultado.map((item) => item.id)).toEqual([1, 4, 7]);
  });

  it('informa Datos no disponibles si un Pokémon admitido viene sin nombre', () => {
    expect(() => construirCatalogoInicial([
      bulbasaur, { url: charmander.url }, squirtle,
    ])).toThrowError('Datos no disponibles');
  });

  it('informa Datos no disponibles si el catálogo está vacío', () => {
    expect(() => construirCatalogoInicial([])).toThrowError('Datos no disponibles');
  });

  it('informa Datos no disponibles si falta alguno de los tres Pokémon', () => {
    expect(() => construirCatalogoInicial([bulbasaur, charmander])).toThrowError('Datos no disponibles');
  });

  it('informa Datos no disponibles si el nombre no corresponde al identificador', () => {
    expect(() => construirCatalogoInicial([
      pokemon(1, 'pikachu'), charmander, squirtle,
    ])).toThrowError('Datos no disponibles');
  });
});
