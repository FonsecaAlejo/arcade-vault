# SPEC 02 — Rutas en inglés, página Home y tab Acerca de

> **Estado:** implementado
> **Depende de:** 01-mvp-visual
> **Fecha:** 2026-08-01
> **Objetivo:** Traducir todas las rutas visibles de la app a inglés, implementar la página Home (landing) en `/` con las 6 secciones del prototipo `home-about/home.jsx`, mover la Biblioteca a `/games`, y agregar el tab "Acerca de" en el Nav apuntando a `/about` sin crear todavía esa página.

## Alcance

**Incluye:**

- Renombrar segmentos de ruta a inglés:
  - `/juegos` → `/games`
  - `/juegos/[id]` → `/games/[id]`
  - `/juegos/[id]/jugar` → `/games/[id]/play`
  - `/salon` → `/hall-of-fame`
  - `/auth` se mantiene igual (ya está en inglés).
- Redirects server-side desde las rutas viejas en español hacia las nuevas en inglés (`/juegos` → `/games`, `/juegos/[id]` → `/games/[id]`, `/juegos/[id]/jugar` → `/games/[id]/play`, `/salon` → `/hall-of-fame`), vía `next.config`.
- Nueva página **Home** en `/` (reemplaza a la Biblioteca como raíz), con las 6 secciones de `references/templates/home-about/home.jsx`: Hero con siluetas flotantes decorativas, "Por qué Arcade Vault" (feature cards), preview de 6 juegos (`MiniCard` con datos reales de `lib/games.ts`), stats, actividad en vivo (ticker + top jugadores, datos mock estáticos igual que el template), precios (plan único gratuito + FAQ) y CTA final.
- La pantalla **Biblioteca** (grilla completa, buscador, chips de categoría) se muda de `app/page.tsx` a `app/games/page.tsx`, sin cambios de contenido ni comportamiento — solo la ruta cambia.
- Actualizar `components/Nav.tsx` (desktop + panel mobile) agregando el link **"Inicio"** (`/`) y el link **"Acerca de"** (`/about`), replicando el orden y estructura de `references/templates/home-about/nav.jsx`: Inicio, Biblioteca, Salón de la Fama, Acerca de.
- Actualizar la lógica `isActive` del Nav: "Inicio" activo solo en `/` exacto; "Biblioteca" activo en `/games` y `/games/[id]*`; "Salón de la Fama" activo en `/hall-of-fame`; "Acerca de" activo en `/about`.
- Actualizar todos los `href`/`navigate` internos que apuntaban a rutas viejas (tarjetas de juego, botones "Jugar ahora", "Volver al vault", links del salón, etc.) para que apunten a las nuevas rutas en inglés.
- El link "Acerca de" queda activo apuntando a `/about` aunque hoy no exista esa página (mostrará el 404 por defecto de Next.js hasta que se implemente en un spec futuro).
- Las labels visibles del Nav y del contenido de pantallas siguen en español (Inicio, Biblioteca, Salón de la Fama, Acerca de) — solo cambian las URLs internas, no el texto.

**Fuera de alcance (para specs futuros):**

- Crear la página `/about` (contenido, secciones, etc.) — solo se agrega el link en el Nav.
- Traducir las labels visibles de la UI a inglés.
- Cualquier lógica de backend real para las cifras de "Actividad en vivo" o "Stats" (siguen siendo datos mock estáticos, igual que en el prototipo).
- Cambios al modelo de datos (`GAMES`, `CATS`, `PLAYERS`, `seededScores`) más allá de reutilizarlo tal cual existe en `lib/games.ts`.
- Cambios a la lógica de sesión, auth o al reproductor.

## Modelo de datos

Este spec no introduce nuevas estructuras de datos persistentes. La página Home reutiliza `GAMES` de `lib/games.ts` para el preview de juegos, y los datos de "Actividad en vivo" / "Top jugadores" / "Stats" quedan como arrays estáticos hardcodeados dentro del componente Home, igual que en `home-about/home.jsx` (no se persisten ni se leen de `localStorage`).

## Plan de implementación

**Procedimiento por cada paso (obligatorio, sin excepciones):**

1. Implementar el paso.
2. Probar el resultado con Playwright (navegación real, sin errores de consola).
3. Reportar al usuario qué se probó y qué se observó.
4. Commitear el paso (un commit por paso, con mensaje descriptivo del paso).
5. Esperar confirmación explícita del usuario ("lock") antes de empezar el paso siguiente. No avanzar sin esa confirmación.

---

1. Renombrar las rutas de juego: mover `app/juegos/[id]/page.tsx` → `app/games/[id]/page.tsx` y `app/juegos/[id]/jugar/page.tsx` → `app/games/[id]/play/page.tsx`, eliminando la carpeta `app/juegos`. Actualizar los links internos que apuntaban a `/juegos/...` para que apunten a `/games/...`.
2. Renombrar `app/salon/page.tsx` → `app/hall-of-fame/page.tsx`. Actualizar los links internos que apuntaban a `/salon`.
3. Mover el contenido actual de la Biblioteca desde `app/page.tsx` a `app/games/page.tsx`, sin cambios de contenido, ajustando los links a tarjetas de juego para usar `/games/[id]`.
4. Portar desde `references/templates/home-about/home.jsx` los componentes de la nueva Home (`FloatingSilhouettes`, `MiniCard`, `FeatureIcon` y las 6 secciones), adaptando `navigate(...)` del prototipo a `Link`/`useRouter` de Next.js, y usando `GAMES` real de `lib/games.ts` para el preview de juegos.
5. Implementar `app/page.tsx` como la nueva Home con los componentes del paso 4: Hero (CTAs a `/games` y `/auth`), "Por qué Arcade Vault", preview de 6 juegos (a `/games/[id]`), stats, actividad en vivo (datos mock estáticos), precios (CTA a `/auth`) y CTA final (a `/games`).
6. Actualizar `components/Nav.tsx` (desktop y panel mobile) agregando los tabs "Inicio" (`/`) y "Acerca de" (`/about`), reordenando los links según `home-about/nav.jsx`, y ajustando `isActive` para los 4 tabs.
7. Agregar redirects permanentes en `next.config` para las rutas viejas en español: `/juegos` → `/games`, `/juegos/[id]` → `/games/[id]`, `/juegos/[id]/jugar` → `/games/[id]/play`, `/salon` → `/hall-of-fame`.
8. Revisión final: navegar todas las pantallas, verificar que no queden links rotos hacia rutas viejas (excepto los redirects del paso 7), que "Acerca de" navegue a `/about` mostrando el 404 por defecto de Next.js, y que no haya errores de consola.

## Criterios de aceptación

- [ ] `/` muestra la nueva página Home con las 6 secciones (Hero, "Por qué Arcade Vault", preview de 6 juegos, stats, actividad en vivo, precios, CTA final).
- [ ] En Home, el preview de juegos muestra datos reales de `lib/games.ts` (título, categoría, cover) y cada card navega a `/games/[id]`.
- [ ] En Home, los CTAs "Explorar juegos" y "Ver todos los juegos" navegan a `/games`; "Crear cuenta" y el CTA de precios navegan a `/auth`; el CTA final navega a `/games`.
- [ ] `/games` muestra la Biblioteca completa (hero, buscador, chips de categoría, grilla de 8 juegos) con el mismo comportamiento que tenía en `/` antes de este spec.
- [ ] `/games/[id]` muestra el detalle de juego correspondiente.
- [ ] `/games/[id]/play` muestra el reproductor correspondiente, con pausa/reanudar/fin y guardado de puntuación funcionando igual que antes.
- [ ] `/hall-of-fame` muestra el salón de la fama con tabs, podio y ranking.
- [ ] Navegar a `/juegos`, `/juegos/[id]`, `/juegos/[id]/jugar` y `/salon` redirige automáticamente a sus equivalentes en inglés (`/games`, `/games/[id]`, `/games/[id]/play`, `/hall-of-fame`).
- [ ] El Nav (desktop y mobile) muestra 4 tabs en este orden: Inicio, Biblioteca, Salón de la Fama, Acerca de.
- [ ] El tab "Acerca de" navega a `/about` y muestra el 404 por defecto de Next.js (la página no existe todavía, es esperado).
- [ ] El estado activo del Nav resalta correctamente: "Inicio" solo en `/`, "Biblioteca" en `/games` y `/games/[id]*`, "Salón de la Fama" en `/hall-of-fame`, "Acerca de" en `/about`.
- [ ] Todas las labels visibles del Nav y de las pantallas siguen en español (no se tradujo texto, solo URLs).
- [ ] Ninguna pantalla produce errores en la consola del navegador al cargar o navegar entre rutas (excepto el 404 esperado de `/about`).
- [ ] Cada paso del plan de implementación fue probado con Playwright, reportado al usuario, commiteado individualmente, y confirmado por el usuario antes de continuar con el siguiente.

## Decisiones

- **Sí:** Home pasa a ser la raíz (`/`) y la Biblioteca se muda a `/games`. Coincide con el modelo del template (`home-about/nav.jsx`), donde "Inicio" es la landing real y "Biblioteca" es una sección aparte.
- **No:** mantener la Biblioteca en `/` y Home en `/home`. Se descartó por no ser fiel al patrón del prototipo.
- **Sí:** mapeo de slugs `juegos→games`, `jugar→play`, `salon→hall-of-fame`. Traducción directa y estándar en inglés; `/auth` ya estaba en inglés y no cambia.
- **Sí:** las labels visibles (Inicio, Biblioteca, Salón de la Fama, Acerca de) siguen en español. Solo se traducen las URLs internas; el dominio del producto se mantiene en español, siguiendo la misma lógica del spec 01 pero invertida (antes: código en inglés/rutas en español; ahora: código y rutas en inglés, labels en español).
- **Sí:** agregar redirects permanentes desde las rutas viejas en español hacia las nuevas en inglés. Evita romper cualquier link ya compartido o guardado, aunque la app esté en etapa temprana.
- **Sí:** el tab "Acerca de" queda activo apuntando a `/about` aunque la página no exista todavía, mostrando el 404 por defecto de Next.js. Es una decisión explícita del usuario: se quiere el tab visible ya, pero la página se construye en un spec futuro.
- **No:** construir la página `/about` en este spec. Queda fuera de alcance a pedido explícito del usuario.
- **Sí:** las 6 secciones de Home se implementan completas y fieles a `home-about/home.jsx` (hero, features, preview, stats, actividad en vivo, precios, CTA final), incluyendo los datos mock estáticos de "actividad en vivo" y "stats" tal cual el prototipo (no hay backend real para esas cifras).
- **Sí:** el preview de juegos en Home usa datos reales de `lib/games.ts` (no datos hardcodeados del template), para mantener consistencia con la Biblioteca real.
- **Sí:** flujo de implementación paso a paso con prueba en Playwright, reporte al usuario, commit individual por paso, y confirmación explícita del usuario antes de avanzar al siguiente paso. Decisión explícita del usuario para este spec.

## Riesgos identificados

- **Links rotos por rutas renombradas:** al mover `/juegos/*` y `/salon` a sus equivalentes en inglés, puede quedar algún `href` interno apuntando a la ruta vieja (ej. dentro del modal de fin de partida o el detalle de juego). Mitigación: paso 8 del plan es una revisión final dedicada a esto, y los redirects del paso 7 cubren cualquier caso que se escape.
- **Confusión por el 404 de `/about`:** dejar el tab "Acerca de" apuntando a una página inexistente es una decisión intencional del usuario, pero si se despliega esta versión, un usuario real vería un 404 estándar de Next.js sin contexto. Aceptado como riesgo conocido hasta el spec de la página About.
