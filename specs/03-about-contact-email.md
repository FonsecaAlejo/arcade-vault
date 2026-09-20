# SPEC 03 — Página About y envío de correo de contacto con Resend

> **Estado:** implementado
> **Depende de:** 02-home-implementation
> **Fecha:** 2026-08-02
> **Objetivo:** Implementar la página `/about` reproduciendo exactamente el prototipo `references/templates/home-about/about.jsx` (secciones Acerca de + Contacto), conectando el formulario de contacto a un envío de correo real vía Resend a través de un Route Handler `/api/contact`.

## Alcance

**Incluye:**

- Nueva página **About** en `app/about/page.tsx`, reemplazando el 404 actual (dejado a propósito en el spec 02).
- Puerto fiel de `references/templates/home-about/about.jsx` a un componente React/TSX: sección hero "ACERCA DE ARCADE VAULT" con misión y fila de 3 highlights (corazón, browser, planta — con sus SVGs pixel-art tal cual `HighlightIcon`), banner divisor animado, y sección de contacto (intro + tips + formulario).
- Efecto `reveal` on-scroll con `IntersectionObserver` igual que el prototipo (banner divisor y sección de contacto aparecen al hacer scroll).
- Formulario de contacto con los mismos campos que el prototipo (Nombre, Correo electrónico, Mensaje), validación cliente idéntica (campos no vacíos → shake de 400ms si falta alguno).
- Campo honeypot oculto adicional (no presente en el prototipo) para descarte silencioso de spam, sin alterar el diseño visible.
- Envío real del formulario: al validar en cliente, `POST` a `app/api/contact/route.ts`, que llama a Resend server-side.
- `app/api/contact/route.ts`: valida formato de email server-side, verifica el honeypot, llama a `resend.emails.send()` con `from: "onboarding@resend.dev"`, `to: "alecjoc85@gmail.com"`, `reply_to: <email del visitante>`, asunto y cuerpo con nombre/email/mensaje del formulario.
- Estado de éxito: mismo `terminal-success` del prototipo (líneas de log simuladas + mensaje final con el nombre en mayúsculas) tras confirmación real del envío.
- Estado de error (nuevo, no existe en el prototipo): variante del terminal con líneas `[ERROR]` cuando el `POST` falla (Resend caído, API key inválida, error de red), con botón para reintentar sin perder lo escrito en el formulario.
- Migración de los estilos `.about*` de `references/templates/home-about/styles.css` (líneas 1072–1110+) a `app/globals.css`, siguiendo el mismo patrón usado para Home en el spec 02.
- Dependencia nueva `resend` en `package.json`.
- Variable de entorno `RESEND_API_KEY`, documentada en `.env.template` (convención ya existente en el repo, en lugar de `.env.example`; sin valor real — el usuario la carga después en `.env.local`).
- Estado activo del Nav para "Acerca de" ya existe desde el spec 02 (`/about`) — no requiere cambios.

**Fuera de alcance (para specs futuros):**

- Cualquier dominio propio verificado en Resend (se usa `onboarding@resend.dev`).
- Rate limiting o CAPTCHA más allá del honeypot.
- Persistencia de los mensajes de contacto en base de datos — el mensaje solo se envía por correo, no se guarda.
- Traducción de labels visibles a inglés (siguen en español, igual que el resto de la app).
- Tests automatizados (no hay test runner configurado en el proyecto).

## Modelo de datos

Este spec no introduce datos persistentes (no hay `localStorage` ni base de datos). Sí define las estructuras que viajan entre el formulario y el Route Handler:

```ts
// Estado local del formulario en About (cliente)
interface ContactFormState {
  name: string;
  email: string;
  msg: string;
  company: string; // honeypot — debe llegar vacío; si tiene valor, es spam
}

// Body enviado a POST /api/contact
interface ContactRequestBody {
  name: string;
  email: string;
  msg: string;
  company: string; // honeypot
}

// Respuesta del Route Handler
type ContactResponse = { ok: true } | { ok: false; error: string }; // mensaje genérico, sin detalles internos de Resend
```

Convenciones:

- El Route Handler descarta silenciosamente (responde `{ ok: true }` sin llamar a Resend) cuando `company` viene con contenido, para no revelar al bot que fue detectado.
- La validación de formato de email server-side usa una regex simple (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), sin librería externa.
- `RESEND_API_KEY` se lee de `process.env.RESEND_API_KEY` dentro del Route Handler; nunca se expone al cliente.

## Plan de implementación

1. Agregar la dependencia `resend` al proyecto (`package.json` / lockfile).
2. Migrar los estilos `.about*` de `references/templates/home-about/styles.css` a `app/globals.css`, sin montar todavía ningún componente (la app sigue funcionando igual que antes).
3. Portar `HighlightIcon` y la sección hero de `about.jsx` (misión + 3 highlights) a un componente `components/About.tsx`, con el efecto `reveal`/`IntersectionObserver`. Montarlo en `app/about/page.tsx` reemplazando el 404. La página `/about` ya muestra la sección "Acerca de" completa.
4. Portar el banner divisor animado y la sección de contacto (intro + tips + formulario) a `About.tsx`, incluyendo el campo honeypot oculto. El formulario todavía no envía nada real: al validar en cliente, muestra directamente el `terminal-success` simulado (mismo comportamiento que el prototipo original), sin llamar a ninguna API.
5. Crear `app/api/contact/route.ts`: valida body (campos no vacíos, formato de email, honeypot vacío), y por ahora responde `{ ok: true }` sin llamar a Resend todavía (permite probar el flujo cliente-servidor sin depender de la API key).
6. Conectar `About.tsx` para hacer `POST` real a `/api/contact` al enviar el formulario, mostrando el `terminal-success` solo si la respuesta es `{ ok: true }`, y agregar el estado de error (`terminal` con líneas `[ERROR]` + botón reintentar) cuando la respuesta es `{ ok: false }` o falla la request.
7. Integrar Resend en el Route Handler: agregar `RESEND_API_KEY` a `.env.template`, instanciar el cliente de Resend y llamar a `resend.emails.send()` con `from: "onboarding@resend.dev"`, `to: "alecjoc85@gmail.com"`, `reply_to` con el email del visitante, asunto (ej. `Nuevo mensaje de contacto — Arcade Vault`) y cuerpo con nombre/email/mensaje. Si `resend.emails.send()` falla o `RESEND_API_KEY` no está configurada, el endpoint responde `{ ok: false, error: "..." }`.
8. Revisión final: probar el formulario end-to-end (con y sin `RESEND_API_KEY` configurada), verificar el honeypot, el estado de error, el estado de éxito, el efecto reveal on-scroll, y que no haya errores de consola ni regresiones en el resto del Nav.

## Criterios de aceptación

- [x] `/about` muestra la sección "Acerca de" (kicker, título, misión, 3 highlights con sus iconos SVG) igual que `about.jsx`.
- [x] El banner divisor animado y la sección de contacto aparecen con efecto reveal al hacer scroll (no visibles de entrada, aparecen al entrar en viewport).
- [x] El formulario de contacto tiene los campos Nombre, Correo electrónico y Mensaje, más un campo honeypot invisible para humanos.
- [x] Enviar el formulario con algún campo vacío dispara el shake y no envía nada.
- [x] Enviar el formulario completo con `RESEND_API_KEY` configurada correctamente envía un correo real a `alecjoc85@gmail.com` desde `onboarding@resend.dev`, con `reply-to` igual al email ingresado en el formulario.
- [x] Tras un envío exitoso, se muestra el `terminal-success` con las líneas de log simuladas y el mensaje final con el nombre en mayúsculas, igual que el prototipo.
- [x] "ENVIAR OTRO MENSAJE" desde el estado de éxito limpia el formulario y permite un nuevo envío.
- [x] Si `RESEND_API_KEY` no está configurada o la llamada a Resend falla, se muestra el estado de error (terminal con líneas `[ERROR]`) con opción de reintentar sin perder lo escrito en el formulario.
- [x] Completar el campo honeypot (simulando un bot) hace que el servidor responda éxito sin enviar ningún correo real.
- [x] El Route Handler rechaza (`{ ok: false }`) un email con formato inválido, sin depender solo de la validación del cliente.
- [x] El tab "Acerca de" del Nav navega a `/about` y queda marcado como activo (ya funcionaba desde el spec 02, se re-verifica que sigue igual).
- [x] Ninguna pantalla produce errores en la consola del navegador al cargar `/about` o interactuar con el formulario.
- [x] `.env.template` documenta `RESEND_API_KEY` sin exponer ningún valor real.

## Decisiones

- **Sí:** puerto fiel de `about.jsx` (hero + highlights + contacto) tal cual el prototipo, sin rediseñar. Pedido explícito del usuario ("exactamente igual como se encuentra en el template").
- **Sí:** envío real de correo vía Resend desde un Route Handler server-side (`/api/contact`), nunca desde el cliente. Necesario para no exponer `RESEND_API_KEY` en el bundle del navegador.
- **Sí:** remitente `onboarding@resend.dev` (dominio de pruebas de Resend). No hay dominio propio verificado todavía; evita bloquear el spec por configuración externa.
- **No:** dominio propio verificado en Resend. Se puede migrar en un spec/ajuste futuro cuando haya un dominio disponible.
- **Sí:** destinatario fijo `alecjoc85@gmail.com`, hardcodeado (no configurable por env var). Es el único destino requerido hoy; no hay necesidad de generalizar.
- **Sí:** `reply-to` = email del visitante. Permite responder directamente desde el cliente de correo sin copiar datos manualmente.
- **Sí:** honeypot simple como única protección anti-spam. Cubre bots básicos sin fricción para usuarios reales ni dependencias externas (CAPTCHA, servicios de terceros).
- **No:** rate limiting o CAPTCHA. Fuera de alcance por ahora; se evalúa si aparece spam real en producción.
- **Sí:** estado de error nuevo (variante del `terminal-success` con líneas `[ERROR]`) en vez de un alert genérico. Mantiene la estética de terminal retro del prototipo también en el caso de fallo, y fue la opción elegida explícitamente.
- **Sí:** validación de formato de email tanto en cliente (implícita, ya que el input es `type="email"`) como en servidor (regex simple, sin librería). El cliente no es confiable como única barrera.
- **Sí:** `RESEND_API_KEY` vía variable de entorno, sin valor en el repo; el usuario la completa en `.env.local` después de este spec. Es la práctica estándar para secretos y coincide con lo indicado por el usuario.
- **No:** persistir los mensajes de contacto en base de datos. Solo se envían por correo; no hay requerimiento de historial ni backend de datos en este spec.

## Riesgos identificados

- **`RESEND_API_KEY` no configurada en producción/desarrollo:** hasta que el usuario cargue la key en `.env.local`, cualquier envío real mostrará el estado de error. Mitigación: paso 5 del plan permite probar el flujo completo (incluyendo el estado de éxito simulado en cliente) antes de integrar Resend, y el estado de error está diseñado para ser un caso esperado, no un bug.
- **Límite de envío de `onboarding@resend.dev`:** el dominio de pruebas de Resend solo permite enviar a la dirección asociada a la cuenta de Resend del usuario. Si `alecjoc85@gmail.com` no coincide con esa cuenta, los envíos fallarán con error de Resend (no de la app). Mitigación: queda documentado como decisión conocida; si ocurre, el siguiente paso sería verificar un dominio propio (fuera de este spec).
- **Honeypot evadido por bots más sofisticados:** un honeypot es una barrera básica, no elimina spam avanzado. Aceptado como riesgo conocido dado que se descartó explícitamente CAPTCHA/rate limiting para este spec.
