# Bitácora de uso de IA

- **Proyecto:** Pokédex con reconocimiento de imágenes (desarrollo parcial de catálogo).
- **Estudiante:** Joan Sebastian Cadena Bobadilla.
- **Funcionalidad:** HU-01. Consultar la lista de tres Pokémon admitidos.
- **Asistente usado:** ChatGPT, modalidad chat para análisis, pruebas, código y refactorización.
- **Fecha de trabajo:** 2026-11-07.

> Registro de las decisiones tomadas durante la preparación asistida de la entrega. El estudiante debe revisar estas decisiones, comprender el código y ejecutar los comandos en su IDE antes de presentar el repositorio como trabajo validado.

## Entradas

### Entrada 1

- **Fecha:** 2026-11-07.
- **Sugerencia:** Elegir una historia Must pequeña del documento de la semana 3, concretamente la HU-01 del catálogo de Bulbasaur, Charmander y Squirtle.
- **Decisión:** Aceptada.
- **Por qué:** La HU-01 sí aparece como Must, tiene salida verificable y un escenario de error explícito. Buscar entre los 151 Pokémon no corresponde a esa HU del documento original.
- **Verificación:** Se revisó la historia y la tabla de priorización del documento de requisitos de la semana 3; la sección HU-01 se incluyó en README.
- **Commit relacionado:** `6a1a17b` (pruebas primero).

### Entrada 2

- **Fecha:** 2026-11-07.
- **Sugerencia:** Modificar directamente el catálogo de 151 del proyecto existente para mostrar únicamente tres Pokémon.
- **Decisión:** Aceptada con cambios.
- **Por qué:** Limitar la portada satisface la HU-01, pero borrar o sustituir la Pokédex de 151 habría eliminado funcionalidades que ya se habían desarrollado.
- **Verificación:** Se creó la ruta `/inicio` para la HU-01 y se preservó `/home` para el catálogo extendido; se verificó la configuración de rutas por inspección y compilación de plantillas Angular.
- **Commit relacionado:** `fc30826` (implementación y conexión con la vista).

### Entrada 3

- **Fecha:** 2026-11-07.
- **Sugerencia alternativa evaluada:** Descartar silenciosamente los registros sin nombre y mostrar las tarjetas válidas restantes.
- **Decisión:** Rechazada.
- **Por qué:** El escenario de error de la HU-01 pide mostrar «Datos no disponibles» sin presentar una tarjeta incompleta. Mostrar solo dos Pokémon cuando falta un tercero tampoco cumpliría el caso esperado.
- **Verificación:** Se revisó el contrato y se conservaron las pruebas que esperan error ante un nombre ausente, catálogo vacío o un Pokémon requerido faltante.
- **Commit relacionado:** `6a1a17b` (casos de error); `fc30826` (implementación de la validación).

### Entrada 4

- **Fecha:** 2026-11-07.
- **Sugerencia:** Escribir antes del código pruebas para catálogo correcto, extras, orden de entrada, URL sin `/` final, ausencia de nombre, lista vacía y datos inconsistentes.
- **Decisión:** Aceptada.
- **Por qué:** Comprueba casos normales, límite y error sin depender de una petición real a Internet y permite detectar un cambio accidental en el contrato.
- **Verificación:** El commit rojo `6a1a17b` no incluía el módulo y una comprobación de TypeScript produjo `TS2307` (módulo inexistente). Después de implementarlo, los ocho casos del archivo `.spec.ts` se ejecutaron satisfactoriamente en un comprobador local alternativo y `tsc --noEmit` pasó. **Vitest/Angular CLI no se pudo ejecutar en este contenedor**, ya que el ZIP traía binarios nativos de Windows y el Node local era anterior al mínimo exigido por Angular CLI. Es necesario ejecutar `npm ci` y `npm test -- --watch=false` en el equipo del estudiante.
- **Commit relacionado:** `6a1a17b`, `fc30826`.

### Entrada 5

- **Fecha:** 2026-11-07.
- **Sugerencia:** Sustituir tres búsquedas y validaciones repetidas por una tabla de identificadores admitidos y un solo recorrido para crear las tarjetas.
- **Decisión:** Aceptada con cambios.
- **Por qué:** Reduce la duplicación y deja el orden definido en un solo lugar sin cambiar las reglas de negocio. Se conserva una validación explícita de nombre e ID.
- **Verificación:** Se mantuvo **sin cambios** el archivo de ocho pruebas. La compilación de TypeScript siguió pasando y los ocho casos volvieron a ejecutarse correctamente con el comprobador local.
- **Commit relacionado:** `0177385` (refactorización).

### Entrada 6

- **Fecha:** 2026-11-07.
- **Sugerencia:** Corregir la importación de `Pokemon` en una prueba heredada y configurar las dependencias de Angular para pruebas de componentes ya existentes.
- **Decisión:** Aceptada.
- **Por qué:** El servicio real se llama `PokemonService`; la prueba antigua importaba una clase que no existe. Se modificó ese código de pruebas **en un commit aparte**, sin alterar los ocho casos ni el contrato de la HU-01.
- **Verificación:** `tsc -p tsconfig.spec.json --noEmit` terminó sin errores tras la corrección. La suite completa de Angular queda pendiente de ejecutar en Windows con el entorno adecuado.
- **Commit relacionado:** `9b62f9e` (reparación de pruebas heredadas).

## Resumen

| Decisión | Cantidad |
|---|---:|
| Aceptadas | 3 |
| Aceptadas con cambios | 2 |
| Rechazadas | 1 |

## Errores detectados y protegidos por las pruebas

Al registrar primero las pruebas, TypeScript reportó `TS2307` porque el módulo de la HU-01 todavía no existía; luego se creó y se corrigió ese fallo de compilación. Las pruebas del nombre ausente, catálogo vacío y Pokémon faltante protegen contra el defecto de mostrar resultados incompletos o falsos. No se afirma que estos tres defectos hayan aparecido en una versión ejecutable previa: son casos de regresión previstos por el contrato. Además, una prueba heredada importaba `Pokemon` en lugar de `PokemonService`; se corrigió por separado.

## Reflexión final (6 líneas)

El asistente me ayudó a convertir una historia de usuario en un contrato y casos de prueba concretos.
También me ayudó a reconocer que el documento original hablaba de tres Pokémon, no de los 151 del catálogo ampliado.
La prueba de registro sin nombre sirve para evitar que la interfaz muestre datos incompletos.
El primer error fue un módulo que aún no existía; por eso se pudo verificar el orden de pruebas antes de implementación.
La refactorización dejó la lista de Pokémon permitidos en un solo lugar y mantuvo los mismos casos.
Para la siguiente entrega ejecutaría Vitest directamente en mi entorno de trabajo y guardaría evidencias de cada ejecución.
