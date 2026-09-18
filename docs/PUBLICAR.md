# Publicar

Publicar significa poner tu página en internet con una dirección que puedas compartir.
Lo hace **Vercel**, gratis, en menos de dos minutos. Si ya la publicaste siguiendo
[INSTALAR.md](INSTALAR.md), sáltate a *Volver a publicar después de un cambio*.

---

## Publicar por primera vez

### 1. Crea tu cuenta de Vercel

1. Entra a [vercel.com](https://vercel.com) y aprieta **Sign Up**.
2. Elige **Continue with GitHub** y autoriza el acceso.
   Hacerlo así conecta las dos cuentas y te ahorra todos los pasos técnicos de después.
3. Cuando te pregunte el plan, elige **Hobby** (es el gratuito). No pide tarjeta.

### 2. Trae tu proyecto

1. Ya dentro de Vercel, aprieta **Add New…** (arriba a la derecha) y luego **Project**.
2. Verás la lista de tus repositorios de GitHub. Localiza el tuyo y aprieta **Import**.
   - Si no aparece: aprieta **Adjust GitHub App Permissions**, marca tu repositorio y
     guarda. Regresa y ya estará en la lista.
3. En la pantalla de configuración **no cambies nada**. El proyecto ya trae su archivo
   `vercel.json` con lo necesario, y Vercel reconoce solo que es un proyecto de Next.js.
4. Aprieta **Deploy**.

### 3. Espera y abre tu página

Verás una pantalla con puntitos de progreso. Cuando termine, aparece un mensaje de
felicitación con una imagen de tu página.

- Aprieta **Continue to Dashboard** para llegar al panel de tu proyecto.
- Arriba verás tu dirección, algo como **`citas-mi-negocio.vercel.app`**.
- Ábrela en el celular y en la computadora. Ya está viva, con candado de seguridad
  (`https://`) incluido, sin que hicieras nada.

Esa dirección **ya la puedes compartir**. Va en tu perfil de Instagram, en tu firma de
correo, en tus mensajes de WhatsApp.

---

## Ponerle tu propio dominio

Opcional. Si tienes (o compras) un dominio como `citas.example.com` o
`agendaconmigo.com`, se conecta así:

### 1. Agrégalo en Vercel

1. En Vercel, entra a tu proyecto.
2. Aprieta la pestaña **Settings** y en el menú de la izquierda, **Domains**.
3. Escribe tu dominio en la caja (por ejemplo `citas.example.com`) y aprieta **Add**.

### 2. Copia lo que Vercel te pide

Vercel te va a mostrar uno o dos renglones de configuración: un tipo de registro (`A` o
`CNAME`), un nombre y un valor.

**No los inventes ni los copies de un tutorial viejo: usa exactamente los que Vercel te
muestra en tu pantalla**, porque cambian según el dominio y la fecha.

### 3. Pégalos donde compraste tu dominio

Entra a donde compraste el dominio (GoDaddy, Namecheap, Google Domains, Hostinger, el que
sea), busca la sección **DNS** o **Administrar DNS**, y agrega los registros tal cual te los
dio Vercel.

### 4. Espera

Vercel revisa solo. Cuando el dominio quede, aparece una palomita verde que dice **Valid
Configuration**. Puede tardar entre 10 minutos y unas horas (rara vez más). El candado de
seguridad se genera solo.

> Consejo práctico: un subdominio como `citas.example.com` es más fácil de conectar que el
> dominio principal, y no toca tu sitio actual. Si es tu primera vez, empieza por ahí.

---

## Volver a publicar después de un cambio

Cada vez que cambies `negocio.config.json`, hay que publicar de nuevo. Es automático: tú
guardas el cambio en GitHub y Vercel lo publica solo. Elige la forma que te acomode.

### Forma A — desde el navegador (sin instalar nada)

1. Entra a tu repositorio en GitHub.
2. Aprieta el archivo **`negocio.config.json`**.
3. Arriba a la derecha aprieta el ícono del lápiz (**Edit this file**).
4. Haz tus cambios.
5. Baja al final de la página. En **Commit changes…** escribe una nota corta de qué
   cambiaste (por ejemplo: *Cambié mis horarios*).
6. Aprieta el botón verde **Commit changes**.

Listo. Vercel lo detecta en segundos y republica solo.

### Forma B — desde tu computadora

En la Terminal, dentro de la carpeta del proyecto:

```bash
git add .
git commit -m "Cambié mis horarios"
git push
```

Vercel republica en cuanto llega el cambio.

### Cómo saber que ya quedó

1. En Vercel, entra a tu proyecto y aprieta la pestaña **Deployments**.
2. El de hasta arriba es el más reciente. Cuando dice **Ready** con punto verde, ya está en
   línea.
3. Si dice **Error** con punto rojo, ábrelo y lee el texto en rojo del final: casi siempre
   es una coma mal puesta en `negocio.config.json`. Corrígela y vuelve a hacer
   **Commit changes**.

### No veo mis cambios en la página

1. Confirma en **Deployments** que el último dice **Ready**.
2. Tu navegador guardó la versión anterior. Recarga forzando:
   - Mac: `Cmd` + `Shift` + `R`
   - Windows: `Ctrl` + `F5`
   - Celular: ábrela en una pestaña privada o de incógnito.

---

## Si algo se rompió y quieres regresar

Vercel guarda todas las versiones publicadas. Para volver a una anterior:

1. Entra a tu proyecto → pestaña **Deployments**.
2. Busca en la lista una versión anterior que sí funcionaba (fíjate en la fecha).
3. Aprieta el menú de tres puntos a su derecha y elige **Instant Rollback** o
   **Promote to Production**, la que te aparezca.

En menos de un minuto tu página vuelve a como estaba. Después corriges con calma.

---

## Lo que hay que revisar antes de compartir tu liga

Hazlo desde el celular, como lo va a hacer tu gente:

- [ ] Se ve tu nombre y tus colores, no los del ejemplo.
- [ ] Aparecen horarios en el calendario (si no, revisa `agenda` en [PERSONALIZAR.md](PERSONALIZAR.md)).
- [ ] Apartas una cita de prueba de principio a fin.
- [ ] El botón de WhatsApp abre **tu** chat con el mensaje escrito y con el código `CITA-`.
- [ ] Copias ese código y lo pegas en `tudireccion.vercel.app/panel`: la cita entra completa.
- [ ] Cambiaste el PIN del tablero (no lo dejes en `1234`).
- [ ] Borras la cita de prueba desde el tablero.

Cuando las siete estén palomeadas, comparte tu liga sin miedo.
