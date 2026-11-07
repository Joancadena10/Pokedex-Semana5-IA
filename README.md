# Pokédex – Ionic / Angular

Proyecto académico con una vista inicial de tres Pokémon (HU-01, semana 5) y la Pokédex extendida de 151 Pokémon que ya existía en el proyecto.

## Funcionalidad de la semana 5

### Historia de usuario HU-01 (prioridad Must)

**Como usuario, quiero consultar la lista de tres Pokémon para saber cuáles puede reconocer la aplicación.**

Criterios de aceptación de la semana 3:

- **Esperado:** al cargar el catálogo de la pantalla inicial aparecen únicamente **Bulbasaur, Charmander y Squirtle**, sin un cuarto Pokémon.
- **Error:** cuando uno de los registros necesarios no contiene nombre, aparece el texto **«Datos no disponibles»** y no se muestra una tarjeta incompleta.

Se conserva el proyecto extendido de 151 Pokémon en `/home`, pero la ruta inicial (`/` redirige a `/inicio`) cumple específicamente la HU-01. Esta historia no implementa todavía captura de cámara ni clasificación de imágenes.

### Contrato de la función

Ruta: `src/app/funcionalidades/catalogo-inicial.ts`

```ts
construirCatalogoInicial(registros: readonly RegistroPokemon[]): PokemonInicial[]
```

- **Entrada:** lista de registros procedentes de la respuesta `results` de PokeAPI `/pokemon-species?limit=151&offset=0`. Cada registro debe tener `url` con un identificador y, para los tres admitidos, `name` no vacío y coherente con su identificador.
- **Salida:** un arreglo nuevo de exactamente tres objetos `{id: number, name: string, image: string}` en el orden Bulbasaur (#1), Charmander (#4), Squirtle (#7).
- **Supuestos:** el catálogo contiene los tres identificadores 1, 4 y 7; las URL pueden terminar en `/` o en el identificador; las imágenes usan el repositorio público de sprites de PokeAPI.
- **Casos límite:** no se cambia el arreglo de entrada; el orden de los registros no altera la salida; los demás Pokémon se ignoran; las URL sin barra final se aceptan.
- **Errores:** si el catálogo está vacío, faltan registros de los tres permitidos, los nombres no corresponden o alguno viene sin nombre, se lanza `Error('Datos no disponibles')`. La pantalla captura el error y muestra ese mensaje en lugar de una tarjeta parcial. También ocurre si falla la petición HTTP.

### Ejemplos de entrada y salida

| Entrada (abreviada por ID y nombre) | Salida esperada |
|---|---|
| `[(1, bulbasaur), (4, charmander), (7, squirtle)]` | `[(1, Bulbasaur), (4, Charmander), (7, Squirtle)]` |
| `[(25, pikachu), (7, squirtle), (1, bulbasaur), (4, charmander)]` | Solo `[(1, Bulbasaur), (4, Charmander), (7, Squirtle)]` |
| `[(1, bulbasaur), (4, nombre ausente), (7, squirtle)]` | `Error('Datos no disponibles')`; en pantalla no aparecen tarjetas |
| `[]` | `Error('Datos no disponibles')` |

En todos los casos, las URL de entrada siguen el formato `https://pokeapi.co/api/v2/pokemon-species/ID/`. La salida real también incluye el campo `image` para cada registro.

### Ejecutar la aplicación y las pruebas

Requisitos: **Node.js 22.22.3 o superior en la rama 22, o Node.js 24.15.0 o superior**, y npm. Se necesita Internet para descargar dependencias e imágenes y consultar PokeAPI.

```bash
npm ci
npm test -- --watch=false
npm start
```

Abrir la URL local que indique Angular. La página inicial `/inicio` muestra tres tarjetas; desde ella se puede abrir `/home` para ver la versión ampliada.

Las pruebas específicas de HU-01 están en `src/app/funcionalidades/catalogo-inicial.spec.ts` e incluyen dos casos normales, casos límite y escenarios de error. El comando general ejecuta también las pruebas del resto del proyecto.

### Evidencia de desarrollo guiado por pruebas

Consultar el historial de la rama `semana5/hu01-catalogo`:

1. Registro inicial del estado proporcionado del proyecto (los archivos llegaban con cambios sin commit).
2. Commit **«HU-01: escribir pruebas primero (rojo, módulo aún inexistente)»**: se agregaron las pruebas sin existir todavía la función.
3. Commit **«HU-01: implementar catálogo de tres Pokémon (verde)»**: implementación y vista conectadas.
4. Commit **«HU-01: refactorizar catálogo con tabla de IDs»**: misma salida y mismas pruebas, menos duplicación.

El proceso fue preparado con ayuda de ChatGPT. Los commits de esta rama son locales y están incluidos en el ZIP; deben revisarse y subirse al repositorio del estudiante. Consultar la bitácora para conocer qué se aceptó, ajustó y rechazó.
