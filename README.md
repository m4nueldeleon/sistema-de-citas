# Sistema de Citas

Una liga que le pasas a la gente para que aparte su cita sola: elige día y hora, deja sus
datos y te llega el aviso por WhatsApp. Del otro lado tienes un tablero donde ves quién
viene hoy, en qué va cada quien y a quién le falta seguimiento.

Todo se personaliza en **un solo archivo** (`negocio.config.json`). No necesitas saber
programar y no pagas nada por publicarlo.

[![Desplegar con Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fm4nueldeleon%2Fsistema-de-citas)

---


> **Antes de apretar cualquier botón: inicia sesión en GitHub.** El botón verde
> **Use this template** solo aparece cuando ya entraste a tu cuenta. Si te asomas como
> visitante, la página se ve completa pero sin ese botón, y parece que algo está mal.

## Míralo funcionando

- **Muestra en vivo:** https://sistema-de-citas-legendaria.vercel.app (el tablero abre con el código `1234`)
- **La clase:** https://legendaria-sistema-citas.vercel.app

## Empieza en 3 pasos

1. **Ponlo en línea** → [docs/INSTALAR.md](docs/INSTALAR.md)
2. **Ponle tu nombre, tus colores y tus horarios** → [docs/PERSONALIZAR.md](docs/PERSONALIZAR.md)
3. **Publícalo y comparte tu liga** → [docs/PUBLICAR.md](docs/PUBLICAR.md)

¿Se te atoró algo? → [docs/PREGUNTAS-FRECUENTES.md](docs/PREGUNTAS-FRECUENTES.md)

---

## Qué incluye

Son tres pantallas. Nada más.

| Pantalla | Dirección | Para qué sirve |
| --- | --- | --- |
| Página de captación | `/` | Tu oferta explicada, el calendario con tus horarios libres y el formulario. Aquí llega la gente. |
| Confirmación | `/gracias` | Le muestra a la persona su cita, le abre WhatsApp contigo y le deja guardarla en su calendario. |
| Tablero | `/panel` | Tu vista privada: citas del día, seguimiento por etapas, notas y respaldo de tu información. |

Además trae, sin que tengas que hacer nada:

- Calendario que respeta tus días, tus horas y los espacios ya apartados.
- Mensaje de WhatsApp ya redactado, tanto para la persona como para ti.
- Cita descargable para Google Calendar, iPhone y Outlook (archivo `.ics`).
- Candado con PIN para entrar al tablero.
- Aviso opcional a una automatización (Make, Zapier, n8n o Google Apps Script).

---

## Cómo funciona sin base de datos

Esta es la parte importante y la vamos a decir sin adornos: **no hay servidor guardando las
citas**. Por eso es gratis y por eso se publica en cinco minutos. La información vive en el
navegador de cada quien.

El puente entre la persona y tú es un **código de cita**: un texto corto que empieza con
`CITA-` y que lleva adentro toda la información de la reservación.

```
1. La persona entra a tu liga                →  example.com
2. Elige día y hora y deja sus datos         →  se guarda en SU navegador
3. Se le abre WhatsApp contigo, ya escrito   →  el mensaje incluye CITA-xxxxxxxxxx
4. Tú copias ese código del chat             →  lo pegas en example.com/panel
5. La cita entra completa, sin teclear nada  →  ahora vive en TU navegador
```

### Los límites (dilo tú antes de que te sorprendan)

- **La cita no aparece sola en tu tablero.** Tienes que pegar el código. Es un toque, pero
  es un toque tuyo. Si no revisas WhatsApp, no hay cita en el tablero.
- **La información vive en el navegador donde la capturaste.** Si abres el tablero en otra
  computadora, ahí empieza vacío.
- **Si borras el historial y los datos del navegador, se borran las citas.** Por eso el
  tablero incluye respaldo descargable: bájalo seguido y guárdalo en tu Drive.
- **Dos personas no comparten el mismo tablero.** Cada quien ve el suyo. Si necesitan
  trabajar juntos, lean la sección *Cuando crezcas*.

Nada de esto es un error del sistema: es el trato. A cambio, tienes una liga que agenda,
publicada gratis, sin base de datos que mantener ni contraseñas que se filtren.

---

## Cómo lo personalizo

Abres `negocio.config.json`, cambias los textos entre comillas, guardas y publicas. Eso es
todo. No se toca ningún otro archivo.

| Llave | Qué cambia |
| --- | --- |
| `negocio` | Tu nombre, tu WhatsApp, tu correo, tu ciudad y tu sitio. |
| `marca` | Los dos colores de toda la página. |
| `oferta` | Cómo se llama tu sesión, cuánto dura, qué cuesta y qué incluye. |
| `landing` | Todos los textos de la página: titular, dolores, beneficios, para quién sí y para quién no, preguntas. |
| `agenda` | Qué días atiendes, de qué hora a qué hora, de cuánto son los espacios y con cuánta anticipación te pueden apartar. |
| `formulario` | Las preguntas que le haces a la persona al reservar. |
| `gracias` | El texto de la pantalla de confirmación y los pasos que le pides seguir. |
| `crm` | El PIN del tablero y las etapas de tu seguimiento. |
| `integraciones` | La dirección opcional para avisarle a una automatización. |

El recorrido llave por llave, con ejemplos de tres giros distintos, está en
[docs/PERSONALIZAR.md](docs/PERSONALIZAR.md).

---

## Requisitos

Honestamente, esto es todo lo que necesitas:

- Una cuenta de **GitHub** (gratis) para tener tu copia del proyecto.
- Una cuenta de **Vercel** (gratis) para publicarlo en internet.
- Tu número de WhatsApp.

No necesitas tarjeta, ni servidor, ni dominio propio (aunque puedes ponerle uno). No
necesitas instalar nada en tu computadora si no quieres: todo se puede hacer desde el
navegador.

---

## Cuando crezcas

Este sistema está hecho para arrancar hoy, no para siempre. Cuando ya tengas volumen, hay
dos puertas abiertas y ninguna te obliga a empezar de cero:

**1. Una automatización (lo más fácil).**
En `integraciones.webhookUrl` pones una dirección de Make, Zapier, n8n o Google Apps
Script. Cada vez que alguien aparte una cita, el sistema le avisa a esa dirección con los
datos de la reservación. Desde ahí puedes guardar la cita en una hoja de Google, mandarte
un correo, crear el contacto en tu CRM o avisarle a tu asistente. Es un renglón en el
archivo de configuración y te quita el paso de pegar el código a mano.

**2. Una base de datos de verdad.**
Conectar una base de datos (por ejemplo Supabase) resuelve de un golpe los límites de
arriba: las citas aparecen solas en tu tablero, las ves desde cualquier dispositivo, tu
asistente y tú trabajan sobre la misma información, y puedes mandar recordatorios
automáticos. A cambio, ya hay cuentas que administrar y llaves que cuidar. Es el siguiente
escalón, no el primero.

---

## Licencia

MIT. Puedes usarlo en tu negocio, cambiarlo y venderlo como parte de tu servicio. Ver
[LICENSE](LICENSE).

Hecho para los alumnos de la **Certificación LEGENDAR·IA** de Manuel de León.
