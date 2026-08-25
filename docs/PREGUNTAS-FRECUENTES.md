# Preguntas frecuentes

Respuestas cortas y honestas. Donde el sistema no lo hace, lo decimos y te damos la salida.

---

## Dinero y requisitos

### ¿Me cuesta algo?

No. GitHub es gratis, Vercel es gratis en su plan **Hobby** y no te pide tarjeta. Lo único
que llega a costar es un dominio propio (entre $200 y $400 pesos al año), y ni siquiera es
necesario: puedes usar la dirección `.vercel.app` que te dan sin costo.

### ¿Necesito saber programar?

No. Cambias textos entre comillas en un solo archivo y aprietas un botón verde. Si sabes
llenar un formulario, sabes usar esto. La guía completa está en
[PERSONALIZAR.md](PERSONALIZAR.md).

### ¿Cuánto me tardo en tenerlo listo?

Publicarlo con los textos de ejemplo: 10 minutos. Dejarlo con tus textos, tus colores y tus
horarios bien pensados: entre una y dos horas. Vale la pena hacerlo con calma una sola vez.

---

## Dónde vive la información

### ¿Dónde se guardan mis citas?

En **el navegador donde las capturaste**. No hay servidor, no hay base de datos, nadie más
tiene tu información. Eso lo hace gratis y privado, pero también significa que la
información no viaja sola de un aparato a otro.

### ¿Pierdo las citas si cambio de computadora?

Sí. El tablero abierto en otra computadora empieza vacío. También pasa si cambias de
navegador (de Chrome a Safari) o si entras en modo privado.

La salida: **el tablero incluye respaldo descargable**. Bájalo, guarda el archivo en tu
Drive o mándatelo por correo, y cárgalo en la otra computadora. Si vas a trabajar en dos
lugares seguido, hazlo parte de tu rutina de fin de día.

### ¿Y si borro el historial del navegador?

Se borran tus citas. No hay forma de recuperarlas si no tienes respaldo.

Hazte el hábito: **descarga el respaldo cada viernes**. Son diez segundos y te salva de un
mal rato.

### ¿Se pueden ver mis datos desde otro lado? ¿Alguien puede espiar a mis clientes?

No hay a dónde entrar: la información de tus clientes nunca sale de tu navegador y nunca
llega a un servidor nuestro ni de nadie más. El riesgo real no es un ataque de internet, es
mucho más doméstico: **quien use tu computadora sin PIN puede abrir tu tablero**. Bloquea tu
sesión cuando te levantes.

---

## Cómo funciona el día a día

### ¿Por qué tengo que pegar un código? ¿No puede llegarme sola la cita?

Porque no hay servidor. La persona reserva en su navegador y tú no tienes cómo enterarte, así
que el sistema arma un **código de cita** (`CITA-xxxxxxxx`) y se lo mete en el mensaje de
WhatsApp que te manda. Tú copias ese código, lo pegas en tu tablero y la cita entra completa,
sin teclear un solo dato.

Es un paso manual, y es el precio de que esto sea gratis y no tenga base de datos.

Si te estorba: pon una automatización en `integraciones.webhookUrl` (Make, Zapier, n8n o
Google Apps Script) y cada reservación te llega sola a una hoja de Google o a tu correo. Está
explicado al final de [PERSONALIZAR.md](PERSONALIZAR.md).

### ¿Y si la persona nunca me manda el WhatsApp?

Entonces no te enteras de esa cita. Por eso el primer paso de la pantalla de confirmación es
mandar el mensaje, y por eso ese mensaje ya va escrito: es un toque. Cuida ese renglón, no lo
quites ni lo bajes en `gracias.pasos`.

Con la automatización del punto anterior, esto deja de depender de la persona.

### ¿Dos personas pueden apartar el mismo horario?

Sí, puede pasar. Cada navegador solo sabe de las citas que él mismo apartó, así que si dos
personas distintas eligen el jueves a las 11, las dos verán el espacio libre.

En la práctica, con pocas citas a la semana casi no ocurre, y **tú lo detectas al pegar el
segundo código**: ves el encimado en tu tablero y le escribes por WhatsApp a uno de los dos
para moverlo. Es un mensaje, no un problema.

Si te está pasando seguido, es una buena señal: ya tienes volumen para el siguiente escalón
(base de datos). Lee *Cuando crezcas* en el [README](../README.md).

### ¿Puedo bloquear un día porque me voy de vacaciones?

No hay un botón de "bloquear día". Lo que se hace es ajustar tu agenda en
`negocio.config.json` y publicar: quitas ese día de `agenda.dias`, o bajas `diasAdelante`
para que no se pueda reservar tan lejos. Cuando regreses, lo dejas como estaba.

### ¿Cómo borro o edito una cita?

Desde tu tablero (`/panel`). Ahí cambias la etapa, agregas notas y borras las citas que ya no
van. Recuerda que estás editando **tu** copia: si le mueves la fecha a alguien, avísale por
WhatsApp, porque su recordatorio no cambia solo.

---

## Personas y equipo

### ¿Puede entrar mi asistente al tablero?

Puede entrar, sí: le pasas la dirección `/panel` y el PIN. Pero ojo con lo importante: **va a
ver su propio tablero, no el tuyo.** Cada quien tiene el suyo, en su navegador.

Salidas reales:
- Que tu asistente sea quien pega todos los códigos y lleva el tablero oficial (uno solo).
- Que compartan una computadora o una sesión del navegador para eso.
- Pasarse el archivo de respaldo, aunque no es cómodo para el día a día.
- Si de verdad necesitan trabajar juntos y al mismo tiempo, necesitan base de datos.

### ¿Sirve si somos dos o tres los que atendemos?

Sirve para captar y para agendar, pero **la agenda es una sola**: no hay agendas separadas por
persona ni asignación automática. Dos caminos:

1. **Una liga por persona.** Publican una copia por cada quien
   (`citas-laura.vercel.app`, `citas-carlos.vercel.app`), cada una con su WhatsApp y sus
   horarios. Es lo más simple y funciona muy bien.
2. **Una sola liga y reparten a mano.** Una persona lleva el tablero y asigna por WhatsApp.

---

## Cobros, correos y recordatorios

### ¿Cómo cobro la cita?

El sistema **no cobra**. No tiene carrito ni pasarela de pago.

Lo que sí puedes hacer, y funciona muy bien: pon en `oferta.precioTexto` cuánto cuesta, y
cobra por WhatsApp cuando la persona te escriba (transferencia, o una liga de cobro de Mercado
Pago, Stripe, Clip o PayPal que le pegas en el chat). Con la conversación ya abierta, cobrar
es fácil.

Si vas a cobrar la cita, súbelo a la pantalla de confirmación: agrega un paso en
`gracias.pasos` que diga que le vas a mandar la liga de pago por WhatsApp.

### ¿Por qué no me llegó un correo cuando alguien reservó?

Porque el sistema no manda correos. Para mandar correos se necesita un servidor, y aquí no
hay. Tu aviso es el mensaje de WhatsApp.

Si quieres correo, la salida es la automatización: pones tu dirección de Make, Zapier o n8n en
`integraciones.webhookUrl` y desde ahí te mandas el correo que quieras.

### ¿Manda recordatorios automáticos el día anterior?

No solo. El tablero te arma el mensaje de recordatorio ya escrito para que lo mandes con un
toque, pero el toque es tuyo. Métete al tablero una vez al día, revisa quién viene mañana y
mándalos. Toma dos minutos y sube muchísimo la asistencia.

### ¿Se conecta con mi Google Calendar?

A medias, y con honestidad: en la pantalla de confirmación la persona puede **agregar la cita
a su calendario** (Google, iPhone, Outlook) con un botón, y tú puedes hacer lo mismo. Pero no
hay sincronización de ida y vuelta: si mueves algo en tu Google Calendar, la página no se
entera, y tus horarios ocupados en Google no bloquean espacios aquí.

---

## Apariencia y dirección

### ¿Cómo cambio los colores?

En `negocio.config.json`, bloque `marca`: `colorPrincipal` y `colorAcento`. Van en formato
hexadecimal (con `#` y seis caracteres). Hay combinaciones probadas en
[PERSONALIZAR.md](PERSONALIZAR.md).

### ¿Puedo usar mi propio dominio en lugar de `.vercel.app`?

Sí, y es gratis conectarlo (solo pagas el dominio). Está paso a paso en
[PUBLICAR.md](PUBLICAR.md). Un subdominio como `citas.tunegocio.com` es lo más fácil de
conectar y no toca tu sitio actual.

### ¿Se ve bien en celular?

Sí, está hecho pensando primero en el celular, que es por donde va a entrar casi toda tu
gente. Aun así, antes de compartir tu liga, ábrela en tu propio teléfono y aparta una cita de
prueba completa.

### ¿Aparece en Google?

No de inmediato, y no es para lo que sirve. Esta liga se comparte: va en tu perfil de
Instagram, en tu firma de correo, en tus anuncios, en tus mensajes. Si quieres aparecer en
buscadores, eso es otro trabajo distinto.

### ¿Puedo tener dos páginas, una por cada servicio?

Sí, y es lo recomendado cuando las ofertas son muy distintas. Haces otra copia del proyecto en
GitHub, la publicas aparte en Vercel y le pones su propia configuración. Son otros 10 minutos.
Cada una tendrá su tablero por separado.

---

## Lo demás

### ¿Qué tan seguro es el PIN del tablero?

Es un candado, no una caja fuerte. Como no hay servidor, el PIN viaja dentro de la página y
alguien con conocimientos técnicos podría verlo. Sirve para que nadie entre por curiosidad o
por accidente.

Lo que de verdad te protege: no compartir la dirección `/panel`, cambiar el PIN de fábrica
(`1234`) y no dejar tu computadora abierta. Y si alguien llegara a entrar, vería un tablero
vacío: tus citas están en tu navegador, no en la página.

Para información delicada (salud, datos financieros), este no es el sistema. Ahí necesitas
base de datos con cuentas de verdad.

### ¿Puedo cobrarle esto a mis clientes o usarlo en mi agencia?

Sí. La licencia es MIT: puedes usarlo, cambiarlo, ponerle tu marca y cobrar por instalarlo o
por el servicio alrededor. No tienes que pedir permiso ni pagar regalías.

### Se me rompió la página, ¿cómo la regreso?

En Vercel, pestaña **Deployments**, buscas una versión anterior que sí funcionaba y le das
**Instant Rollback** (o **Promote to Production**). En menos de un minuto vuelve a estar como
antes. Está explicado en [PUBLICAR.md](PUBLICAR.md).

### ¿Y cuando ya no me alcance esto?

Es la señal buena. Dos escalones, en orden:

1. **Automatización** (`integraciones.webhookUrl`): te quita el paso de pegar códigos.
2. **Base de datos**: citas que llegan solas al tablero, visibles desde cualquier aparato,
   equipo trabajando sobre la misma información y recordatorios automáticos.

No tiras nada de lo que hiciste: tus textos, tus horarios y tu formulario se reaprovechan.

### Sigo atorado, ¿a quién le pregunto?

Abre una petición de ayuda en el repositorio: pestaña **Issues** → **New issue** → plantilla
**Necesito ayuda**. Cuéntanos qué apretaste, qué esperabas y qué te salió. Entre más concreto,
más rápido te sacamos del hoyo.
