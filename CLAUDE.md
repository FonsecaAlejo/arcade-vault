# CLAUDE.md

Este archivo brinda guía a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

@AGENTS.md

## Proyecto

Arcade Vault (`README.md`) es una plataforma de arcade online donde los usuarios juegan juegos estilo retro (Bloque Buster, Caída, Serpentina, Glotón, Invasores, Rocas, Ranaria, Duelo Pixel) y compiten en tablas de puntuación. El desarrollo sigue Spec Driven Design usando las convenciones `/spec` y `/spec-impl` de https://github.com/Klerith/fernando-skills.

La app es un proyecto Next.js con App Router (`app/`), actualmente en el estado inicial del scaffold de `create-next-app` — solo existen `app/layout.tsx` y `app/page.tsx` por ahora.

### Referencia de diseño (no es código Next.js ejecutable)

`resources/templates/` contiene un prototipo estático en HTML/CDN-React de toda la UI a partir del cual se construye la app real — tratarlo como una especificación de diseño/comportamiento, no como código para importar directamente:

- `Arcade Vault.html` — shell HTML independiente que carga los archivos `.jsx` vía CDN de React/Babel.
- `app.jsx` — componente raíz con ruteo basado en hash (`biblioteca`, `detalle`, `player`, `auth`, `salon`) y estado de auth/puntajes persistido en `localStorage`. En la app real este ruteo/estado debe reimplementarse usando las convenciones de App Router y persistencia real, no portarse tal cual.
- `nav.jsx`, `biblioteca.jsx` (grilla/biblioteca de juegos), `detalle.jsx` (detalle de juego), `reproductor.jsx` (pantalla del jugador), `auth.jsx` (login/registro), `salon.jsx` (salón de la fama / tabla de líderes) — un componente prototipo por pantalla.
- `data.jsx` — datos mock: el catálogo `GAMES` (id, título, categoría, color, mejor puntaje, jugadas), categorías `CATS`, lista `PLAYERS`, y `seededScores()` para generar filas de leaderboard simuladas.
- `styles.css` — el sistema de diseño neón/retro-arcade: variables CSS para colores (`--cyan`, `--magenta`, `--yellow`, `--green`, colores de rango oro/plata/bronce), fuentes (`--pixel`: "Press Start 2P", `--mono`: "JetBrains Mono"), y el efecto de fondo con scanlines/grilla. Reutilizar estos tokens al construir los estilos reales en Tailwind/CSS para que la app coincida con el look del prototipo.

## Trabajando en este repo

- **Esta versión de Next.js difiere de tus datos de entrenamiento.** Antes de escribir código de ruteo, data-fetching, caching, imágenes o middleware, revisar la guía correspondiente en `node_modules/next/dist/docs/01-app/` (getting-started y guides) y en particular `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` para ver los breaking changes respecto al Next.js que ya conocés — los más relevantes: Turbopack es el bundler por defecto, las Request APIs (`params`, `searchParams`, cookies/headers) son asíncronas, `middleware.ts` está siendo renombrado a `proxy.ts`, y cambiaron los valores por defecto de `next/image` (lista de qualities, cache TTL, límite de redirects).
- El alias de path `@/*` apunta a la raíz del proyecto (ver `tsconfig.json`).
- El estilado usa Tailwind CSS v4 (`@tailwindcss/postcss`, sin archivo `tailwind.config.*` — la config vive en `app/globals.css`/CSS).

Todavía no hay un test runner configurado.

## Skills

- **Diseño de interfaz de usuario**: usar siempre la skill `frontend-design` al crear o modificar UI (nuevas pantallas, componentes, estilos), para mantener una dirección visual intencional y coherente con el sistema de diseño neón/retro-arcade descrito arriba.
