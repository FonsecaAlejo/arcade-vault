# SPEC 04 — Integración con Supabase

> **Estado:** Implementado
> **Depende de:** 03-about-contact-email
> **Fecha:** 2026-09-20
> **Objetivo:** Instalar y configurar los clientes de Supabase (`@supabase/supabase-js` y `@supabase/ssr`) para Next.js App Router — browser y Server Component/Route Handler — conectados al proyecto Supabase ya existente, dejando la integración lista y verificada para que specs futuros implementen auth real, leaderboard persistente, realtime y edge functions.

## Alcance

**Incluye:**

- Instalar `@supabase/supabase-js` y `@supabase/ssr`.
- Crear `lib/supabase/client.ts` — cliente browser para componentes `"use client"`.
- Crear `lib/supabase/server.ts` — cliente server para Server Components y Route Handlers, con manejo de cookies asíncrono (`cookies()`).
- Añadir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` a `.env.template` (sin valores) y como placeholders vacíos en `.env.local` (el usuario completa los valores reales de su proyecto Supabase ya existente).
- Verificación de que la integración compila y no produce errores: ambos clientes se instancian sin excepciones y la app sigue funcionando igual que antes.

**Fuera de alcance (para specs futuros):**

- `proxy.ts` / refresco de sesión en cada request — no aplica todavía porque no hay auth real; se agrega junto con el spec que implemente Supabase Auth.
- Creación de tablas o esquema en Supabase.
- Conectar el `/auth` existente con Supabase Auth.
- Cualquier uso real del cliente en componentes o páginas existentes.
- Realtime, Edge Functions y Storage — quedan para specs futuros.
- `SUPABASE_SERVICE_ROLE_KEY` — se añadirá cuando un spec lo requiera.

## Modelo de datos

Este spec no introduce estructuras de datos nuevas ni tablas en Supabase — solo configura los clientes de conexión. Se omite esta sección.

## Plan de implementación

1. Instalar las dependencias `@supabase/supabase-js` y `@supabase/ssr` (`package.json` / lockfile).
2. Añadir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` a `.env.template` (sin valores) y como placeholders vacíos en `.env.local`.
3. Crear `lib/supabase/client.ts` con `createBrowserClient` de `@supabase/ssr`, leyendo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Crear `lib/supabase/server.ts` con `createServerClient` de `@supabase/ssr`, usando `cookies()` asíncrono de Next.js para el manejo de cookies en Server Components y Route Handlers.
5. Verificación final: el usuario completa los valores reales en `.env.local`, se corre `npm run build` (o `next dev`) y se confirma que no hay errores de compilación ni de consola, y que ninguna pantalla existente cambió de comportamiento.

## Criterios de aceptación

- [x] `@supabase/supabase-js` y `@supabase/ssr` están instalados como dependencias del proyecto.
- [x] `.env.template` documenta `NEXT_PUBLIC_SUPABASE_URL` y la key pública sin valores reales. *(Ver desviación en Decisiones: se usó `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en vez de `NEXT_PUBLIC_SUPABASE_ANON_KEY`.)*
- [x] Las variables tienen valores reales cargados en `.env`. *(Ver desviación en Decisiones: el proyecto usa `.env`, no `.env.local`, y ya tenía los valores reales de antes de este spec.)*
- [x] `lib/supabase/client.ts` exporta un cliente browser funcional (`createBrowserClient`).
- [x] `lib/supabase/server.ts` exporta un cliente server funcional (`createServerClient`) que maneja cookies de forma asíncrona.
- [x] Con los valores reales cargados en `.env`, `npm run build` compila sin errores.
- [x] `next dev` levanta sin errores de consola y ninguna pantalla existente (`/`, `/games`, `/games/[id]`, `/games/[id]/play`, `/hall-of-fame`, `/about`, `/auth`) cambia de comportamiento respecto a antes de este spec.

## Decisiones

- **Sí:** `@supabase/ssr` en lugar de instanciar `createClient` de `@supabase/supabase-js` directamente. El paquete SSR maneja cookies y sesión correctamente en Next.js App Router; usar el cliente básico requeriría refactorizar cuando llegue el spec de Auth.
- **Sí:** Dos archivos separados (`client.ts` y `server.ts`) en lugar de uno universal. Next.js App Router tiene contextos de ejecución distintos (browser vs. server); un solo cliente que intente cubrir ambos rompe en uno de los dos contextos.
- **No:** `SUPABASE_SERVICE_ROLE_KEY` en este spec. Solo se añade cuando un spec concreto lo requiera; incluirla ahora sería infraestructura sin uso.
- **No:** Crear tablas o esquema en Supabase. El objetivo de este spec es únicamente la plomería de conexión; el modelo de datos se define spec a spec según la funcionalidad.
- **No:** Conectar `/auth` en este spec. La autenticación real merece su propio spec con flujo, estados de error y redirecciones definidos explícitamente.

## Desviaciones durante la implementación

- **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en vez de `NEXT_PUBLIC_SUPABASE_ANON_KEY`.** El proyecto ya tenía `.env.template`/`.env` con la nomenclatura nueva de Supabase (publishable/secret keys reemplazando anon/service_role) desde antes de este spec. Decisión del usuario: reusar la variable existente en vez de introducir una nueva.
- **`.env` en vez de `.env.local`.** El proyecto usa la convención `.env`/`.env.template` (ver [[project_env_template_convention]]), no `.env.local`. Las variables ya tenían valores reales cargados, por lo que no se crearon placeholders vacíos nuevos.
