# SPEC 01 — Pantallas visuales del MVP de Arcade Vault

> **Estado:** implementado
> **Depende de:** —
> **Fecha:** 2026-08-01
> **Objetivo:** Construir en Next.js App Router las cinco pantallas del prototipo (biblioteca, detalle de juego, reproductor placeholder, autenticación y salón de la fama), con estilos, navegación y datos mock, sin implementar la lógica jugable de ningún juego.

## Alcance

**Incluye:**

- Ruteo por segmento en App Router: `/` (biblioteca), `/juegos/[id]` (detalle), `/juegos/[id]/jugar` (reproductor placeholder), `/auth` (login/registro), `/salon` (salón de la fama).
- Componente `Nav` persistente en el layout, con versión desktop y panel deslizante mobile (hamburguesa), estado activo por ruta, contador de créditos estático y botón de sesión (login / nombre de usuario).
- Pantalla **Biblioteca**: hero, buscador por nombre, chips de categoría (`CATS`), grilla de tarjetas de juego (`GameCard`) con tilt al mouseover, estado vacío "NO HAY RESULTADOS".
- Pantalla **Detalle de juego**: portada, tags, descripción larga, estadísticas (partidas, mejor global, dificultad), acciones ("Jugar ahora", "Volver al vault"), tabla de mejores puntuaciones (leaderboard) generada con `seededScores`.
- Pantalla **Reproductor**: HUD (jugador, puntuación, vidas, nivel), marco tipo CRT con arena de juego decorativa, pausa/reanudar, fin de juego simulado (puntaje sube solo por temporizador, igual que el prototipo), modal de fin con guardado de puntuación e inputs de iniciales.
- Pantalla **Auth**: tabs "Iniciar sesión" / "Crear cuenta", formulario sin validación real, botón "Jugar como invitado", botones sociales decorativos (Google/GitHub, sin acción).
- Pantalla **Salón de la fama**: tabs por juego, podio (oro/plata/bronce), tabla de ranking completa, fila destacada "tu mejor marca" cuando hay usuario logueado.
- Persistencia de sesión (`user`) y de puntajes guardados (`av_scores`) en `localStorage`, replicando el comportamiento de `app.jsx`.
- Migración del sistema de diseño (`styles.css`) a Tailwind CSS v4 / CSS de `app/globals.css`, preservando tokens de color, tipografías (`Press Start 2P`, `JetBrains Mono`) y efecto de fondo con scanlines/grilla.
- Datos mock (`GAMES`, `CATS`, `PLAYERS`, `seededScores`) migrados a un módulo TypeScript tipado (ubicación a definir en el plan de implementación).
- Layout responsive (desktop y mobile) en todas las pantallas.

**Fuera de alcance (para specs futuros):**

- Lógica jugable real de cualquiera de los 8 juegos (Bloque Buster, Caída, Serpentina, Glotón, Invasores, Rocas, Ranaria, Duelo Pixel).
- Autenticación real (backend, hashing de contraseñas, OAuth funcional con Google/GitHub).
- Persistencia en servidor/base de datos de usuarios y puntajes.
- Validación de formularios de auth.
- Imágenes de portada reales (se mantienen los covers CSS/gradientes del prototipo).
- Sistema de créditos funcional (el contador es decorativo).

## Modelo de datos

Migración directa de `references/templates/data.jsx` a un módulo TypeScript tipado (ubicación exacta a fijar en el plan de implementación):

```ts
interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: 'ARCADE' | 'PUZZLE' | 'SHOOTER' | 'VERSUS';
  cover: string; // clase CSS del gradiente, ej. "cover-bricks"
  color: 'cyan' | 'magenta' | 'yellow' | 'green';
  best: number;
  plays: string; // ej. "12.4K"
}

const GAMES: Game[]; // 8 juegos, igual contenido que data.jsx
const CATS: string[]; // ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]
const PLAYERS: string[]; // 18 nombres para generar leaderboards simulados

interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string; // "DD/MM/2026"
}

function seededScores(seed: number, count?: number): ScoreRow[];
```

Estado persistido en `localStorage` (mismas claves que `app.jsx`):

```ts
// clave "av_user"
interface User {
  name: string; // hasta 10 caracteres, mayúsculas
}

// clave "av_scores"
interface SavedScore {
  game: string; // id del juego
  score: number;
  name: string;
  at: number; // Date.now()
}
```

Convenciones:

- `User | null`: `null` representa invitado o sesión cerrada.
- `av_scores` es un array acumulativo; cada partida agrega una entrada, nunca se sobrescribe.
- El puntaje simulado en el reproductor se genera igual que en `reproductor.jsx`: incrementos aleatorios de 10–100 cada 220ms mientras no esté pausado ni terminado.

## Plan de implementación

1. Portar los tokens de diseño de `references/templates/styles.css` (colores, fuentes `--pixel`/`--mono`, fondo scanlines/grilla) a `app/globals.css` usando Tailwind CSS v4 (`@theme`), sin tocar aún ningún componente.
2. Crear el módulo de datos mock `lib/games.ts` con `Game`, `GAMES`, `CATS`, `PLAYERS`, `ScoreRow` y `seededScores()`, migrados de `data.jsx`.
3. Crear el componente `components/Nav.tsx` (desktop) y montarlo en `app/layout.tsx`, con logo, links a Biblioteca/Salón y botón de "Iniciar sesión" sin lógica todavía. La app corre y muestra el nav en todas las páginas.
4. Agregar el panel mobile deslizante y el botón hamburguesa a `Nav.tsx`, con estado local `open`.
5. Implementar la pantalla Biblioteca en `app/page.tsx`: hero, buscador, chips de categoría y grilla con `components/GameCard.tsx` (incluye tilt on mousemove), usando `GAMES`/`CATS` de `lib/games.ts`. Estado vacío incluido.
6. Implementar la pantalla de detalle en `app/juegos/[id]/page.tsx`: portada, tags, descripción, stats, acciones y leaderboard con `seededScores`.
7. Implementar la pantalla de reproductor en `app/juegos/[id]/jugar/page.tsx`: HUD, marco CRT decorativo, simulación de puntaje con `setInterval`, pausa/fin de juego y modal de fin (sin guardar aún, solo UI).
8. Implementar la pantalla de auth en `app/auth/page.tsx`: tabs login/registro, formulario sin validación, botón de invitado y botones sociales decorativos, sin conexión a sesión todavía.
9. Crear `lib/session.ts` (o hook `useSession`) que lea/escriba `av_user` y `av_scores` en `localStorage`, y conectar: login/registro/invitado en Auth, botón de sesión en Nav (mostrar nombre + logout), y el guardado de puntaje en el modal de fin del reproductor.
10. Implementar la pantalla de salón en `app/salon/page.tsx`: tabs por juego, podio, tabla de ranking y fila "tu mejor marca" cuando hay `user` activo.
11. Pasada de responsive en las 6 pantallas (biblioteca, detalle, reproductor, auth, salón, nav) verificando breakpoints mobile/desktop contra el prototipo.

## Criterios de aceptación

- [ ] `/` muestra la biblioteca con hero, buscador, chips de categoría y grilla de las 8 tarjetas de juego.
- [ ] Buscar por nombre y filtrar por categoría en la biblioteca actualiza la grilla sin recargar la página.
- [ ] Buscar un término sin resultados muestra el estado "NO HAY RESULTADOS".
- [ ] Hacer click en una tarjeta o en "JUGAR" navega a `/juegos/[id]` con el detalle correcto.
- [ ] `/juegos/[id]` muestra portada, tags, descripción, estadísticas y una tabla de 10 mejores puntuaciones.
- [ ] En el detalle, "JUGAR AHORA" navega a `/juegos/[id]/jugar`.
- [ ] En `/juegos/[id]/jugar`, el puntaje sube automáticamente cada ~220ms mientras no está pausado ni terminado.
- [ ] El botón "PAUSA" detiene el incremento de puntaje y "REANUDAR" lo continúa.
- [ ] El botón "FIN" abre el modal de fin de juego con el puntaje final.
- [ ] Guardar la puntuación en el modal de fin persiste una entrada en `localStorage` bajo la clave `av_scores`.
- [ ] "JUGAR DE NUEVO" reinicia puntaje, vidas, nivel y cierra el modal.
- [ ] `/auth` permite completar el formulario de login o registro y, al enviarlo, crea una sesión y navega a `/`.
- [ ] "JUGAR COMO INVITADO" navega a `/` sin crear sesión (`av_user` queda `null`).
- [ ] Iniciar sesión persiste `av_user` en `localStorage` y el Nav muestra el nombre de usuario en vez de "Iniciar Sesión".
- [ ] Recargar la página después de loguearse mantiene la sesión activa (se lee de `localStorage`).
- [ ] Cerrar sesión desde el Nav elimina `av_user` de `localStorage` y vuelve a mostrar "Iniciar Sesión".
- [ ] `/salon` muestra podio (oro/plata/bronce) y tabla completa de ranking para el juego seleccionado en las tabs.
- [ ] Cambiar de tab en el salón actualiza podio y tabla al juego correspondiente.
- [ ] Con sesión activa, `/salon` muestra la fila "TU MEJOR MARCA" adicional; sin sesión, no aparece.
- [ ] El menú hamburguesa mobile abre/cierra el panel de navegación deslizante en viewports angostos.
- [ ] Ninguna pantalla produce errores en la consola del navegador al cargar o navegar entre rutas.

## Decisiones

- **Sí:** rutas por segmento (`/juegos/[id]`, `/juegos/[id]/jugar`, `/auth`, `/salon`) en vez de query params. Es más idiomático en App Router y da URLs limpias y compartibles.
- **No:** ruteo por hash como en `app.jsx`. Era necesario en el prototipo estático sin backend de rutas; Next.js App Router reemplaza esa necesidad.
- **Sí:** persistencia en `localStorage` para `av_user` y `av_scores`, igual que el prototipo. No hay backend en este MVP y el volumen de datos es mínimo.
- **No:** base de datos o API real para usuarios/puntajes. Corresponde a un spec futuro de backend/autenticación real.
- **Sí:** reproductor con simulación de puntaje idéntica al prototipo (incrementos aleatorios por `setInterval`). Es un placeholder visual de "pantalla de juego", no un juego real; los 8 juegos quedan fuera de este spec.
- **Sí:** datos mock en un módulo TypeScript (`lib/games.ts`) en vez de JSON. Permite tipado fuerte y reutilizar `seededScores()` como función tipada sin parsear JSON en runtime.
- **Sí:** covers de juego siguen siendo CSS/gradientes, no imágenes reales. Evita depender de assets que no existen aún y mantiene la estética del prototipo.
- **Sí:** contador de créditos estático ("CRÉDITOS · 03") como elemento decorativo. No hay lógica de créditos en este MVP.
- **Sí:** formulario de auth sin validación real, botones sociales decorativos sin acción. Replica el comportamiento del prototipo; la autenticación real es un spec futuro.
- **Sí:** layout responsive completo (desktop + mobile) desde este spec, incluyendo el panel de navegación deslizante. El prototipo ya lo define visualmente y no se quiere posponer.
- **Sí:** componentes y archivos nombrados en inglés (`GameCard.tsx`, `Nav.tsx`), rutas visibles en español (`/juegos`, `/salon`). Sigue la convención estándar de código en inglés manteniendo el dominio del producto en español.

## Lo que NO está en este spec

- Lógica jugable real de ninguno de los 8 juegos (Bloque Buster, Caída, Serpentina, Glotón, Invasores, Rocas, Ranaria, Duelo Pixel).
- Autenticación real (backend, hashing, OAuth funcional).
- Base de datos o API de usuarios/puntajes.
- Validación de formularios de auth.
- Imágenes de portada reales.
- Sistema de créditos funcional.

Cada uno de estos, si se implementa, va en su propio spec.
