# Preparación de la entrega – Semana 5

Este ZIP conserva el historial Git (`.git`), el código existente de la Pokédex, el nuevo catálogo HU-01, el README y la bitácora.

## En Windows con VS Code

1. Descomprime la carpeta y abre `pokedex_semana5` en Visual Studio Code.
2. Abre la terminal integrada y comprueba `node --version`. Usa Node 24.15.0 o superior (o Node 22.22.3 o superior de la rama 22).
3. Ejecuta `npm ci` para instalar dependencias para **tu sistema**. No copies `node_modules` del ZIP original.
4. Ejecuta `npm test -- --watch=false`. Guarda una captura de pantalla del resultado.
5. Ejecuta `npm start` y abre la ruta local indicada. La pantalla inicial muestra tres Pokémon; `/home` conserva los 151.
6. Revisa el código y la bitácora; ajusta las decisiones para que describan exactamente lo que validaste.

## Verificar el historial Git

Ejecuta:

```bash
git log --oneline --decorate -6
git status
```

Debes ver, entre otros, los commits de pruebas primero (`6a1a17b`), implementación (`fc30826`) y refactor (`0177385`). Se incluyen también un commit con el estado recibido y otro para corregir pruebas heredadas. La rama actual es `semana5/hu01-catalogo`.

## Subir a GitHub

Si creas un repositorio vacío nuevo:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin semana5/hu01-catalogo
```

Si ya existe un remoto `origin`, **no** lo agregues de nuevo; revisa `git remote -v` y sigue el flujo de tu repositorio. Comparte con el docente el enlace de la rama o del repositorio con acceso de lectura.

## Comprobaciones realizadas en este entorno

- Fase roja: `tsc -p tsconfig.spec.json --noEmit` en el commit de pruebas inicial reportó `TS2307`, porque la función aún no existía.
- Fase final: `tsc -p tsconfig.app.json --noEmit`, `tsc -p tsconfig.spec.json --noEmit` y el compilador de plantillas `ngc` terminaron correctamente.
- Se ejecutaron los ocho casos contenidos en el archivo de pruebas HU-01 mediante un verificador local alternativo con 8/8 correctos.
- **No se ha confirmado la ejecución real de Vitest en esta máquina:** el ZIP original contenía dependencias nativas de Windows y la versión de Node de este contenedor no cumplía el mínimo exigido por Angular CLI. Reinstala con `npm ci` y valida en tu PC antes de entregar.
