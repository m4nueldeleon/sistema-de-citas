# Personalizar

Todo lo que se ve en tu página sale de **un solo archivo**: `negocio.config.json`.
No hay que tocar ningún otro. Aquí va llave por llave, con ejemplos de tres negocios
distintos al final.

## Antes de empezar: tres reglas del archivo

1. **Solo cambias lo que está entre comillas.** `"nombre": "Tu Negocio"` → cambia
   `Tu Negocio`, no `nombre`.
2. **Las comas importan.** Cada renglón de una lista termina en coma, **menos el último**.
   Si la página se queda en blanco, casi siempre es una coma.
3. **Los números y `true`/`false` van sin comillas.** `"duracionMinutos": 30` y
   `"activa": false` están bien. `"duracionMinutos": "30"` rompe la página.

Consejo: antes de cambiar mucho, cambia poquito y publica. Así sabes qué renglón fue si
algo se rompe.

---

## 1. `negocio` — quién eres

```json
"negocio": {
  "nombre": "Tu Negocio",
  "logoTexto": "TN",
  "whatsapp": "5213312345678",
  "correo": "hola@tunegocio.com",
  "ciudad": "Guadalajara, México",
  "sitio": "https://tunegocio.com"
}
```

| Llave | Qué es |
| --- | --- |
| `nombre` | Como te presentas. Sale en la página, en los mensajes y en la cita del calendario. |
| `logoTexto` | Dos o tres letras que hacen de logo. Iniciales, normalmente. |
| `whatsapp` | **El más importante.** Tu número con lada de país, solo números. México: `52` + `1` + los 10 dígitos. Ejemplo: `5213312345678`. Estados Unidos: `1` + los 10 dígitos. Sin espacios, sin guiones, sin `+`. |
| `correo` | Tu correo de contacto. |
| `ciudad` | Dónde estás. Da confianza. |
| `sitio` | Tu sitio principal, si tienes. |

> **Comprueba tu número.** Abre `https://wa.me/5213312345678` en tu celular con tu propio
> número. Si abre tu chat, está bien escrito. Si dice que el número no es válido, revísalo
> antes de publicar: todas las citas pasan por ahí.

---

## 2. `marca` — tus colores

```json
"marca": {
  "colorPrincipal": "#E9C36A",
  "colorAcento": "#6FE3FF",
  "modo": "oscuro"
}
```

- `colorPrincipal`: el color de los botones y los detalles importantes.
- `colorAcento`: el color secundario, para resaltar cosas puntuales.
- `modo`: `"oscuro"` o `"claro"`.

Los colores van en formato de seis caracteres con `#` adelante. Si no sabes el tuyo, busca
"selector de color hexadecimal" o toma el de tu logo con cualquier editor de imágenes.

Combinaciones que funcionan bien en fondo oscuro:

| Giro | Principal | Acento |
| --- | --- | --- |
| Consultoría / negocios | `#E9C36A` (dorado) | `#6FE3FF` (azul claro) |
| Salud / dental | `#6FE3FF` (azul claro) | `#8FE6C0` (verde menta) |
| Inmobiliaria | `#C9A227` (oro viejo) | `#E8E3D8` (hueso) |

---

## 3. `oferta` — qué vas a dar en la cita

```json
"oferta": {
  "nombre": "Sesión de diagnóstico",
  "duracionMinutos": 30,
  "precioTexto": "Sin costo",
  "incluye": [
    "Revisamos dónde se te están cayendo las ventas",
    "Te digo qué cambiar primero y por qué",
    "Sales con un plan escrito de 3 pasos"
  ]
}
```

- `nombre`: cómo se llama lo que aparta la persona. Sale también en el mensaje de WhatsApp
  y en el evento del calendario.
- `duracionMinutos`: cuánto dura. Es texto informativo; lo que parte la agenda es
  `agenda.duracionMinutos` (ponlos iguales para no confundirte).
- `precioTexto`: escríbelo como quieras: `"Sin costo"`, `"$500 MXN"`, `"Primera valoración
  gratis"`.
- `incluye`: qué se lleva la persona. Tres renglones bastan. Habla de resultados, no de
  procesos.

---

## 4. `landing` — todos los textos de la página

Es el bloque más largo. Ninguna llave es opcional, pero las listas pueden tener más o menos
renglones de los que trae el ejemplo.

### Encabezado

```json
"titular": "Consigue más citas sin perseguir a nadie",
"subtitular": "Agenda 30 minutos y salimos con un plan claro para tu negocio.",
"ctaTexto": "Quiero mi cita",
"urgencia": "Solo abro 8 espacios por semana."
```

- `titular`: la promesa en una frase corta. Que hable del resultado de la persona, no de ti.
- `subtitular`: la explicación en un renglón.
- `ctaTexto`: el texto del botón. Que empiece con un verbo: *Quiero, Aparto, Reservo*.
- `urgencia`: la razón real por la que hay que apartar ya. **Que sea cierta.** Si no tienes
  una, déjala vacía: `"urgencia": ""`.

### `dolores` — lo que le duele hoy a quien te lee

```json
"dolores": [
  { "titulo": "La gente pregunta y no vuelve", "texto": "Contestas, mandas precios y se pierde la conversación." }
]
```

Escríbelos con las palabras que usan tus clientes, no con las tuyas. Tres van bien.

### `beneficios` — cómo se ve su vida después

```json
"beneficios": [
  { "titulo": "Una liga que agenda sola", "texto": "La pegas en tu perfil y la gente elige su horario sin escribirte." }
]
```

Mismo formato. Un beneficio por cada dolor, en el mismo orden, se lee muy bien.

### `paraQuien` y `noParaQuien`

```json
"paraQuien": [
  "Vendes con una conversación",
  "Ya te llega gente pero se te pierde en el chat"
],
"noParaQuien": [
  "Vendes producto de mostrador sin cita",
  "Buscas una tienda en línea con carrito"
]
```

Decir para quién **no** es filtra a los curiosos y te ahorra citas perdidas. No lo quites
por miedo: es lo que hace que quien sí es, se sienta identificado.

### `preguntas` — dudas antes de reservar

```json
"preguntas": [
  { "p": "¿Cuánto dura la sesión?", "r": "30 minutos. Empieza y termina a tiempo." }
]
```

Pon las tres o cuatro que te preguntan siempre por WhatsApp. Cada duda que resuelvas aquí
es una cita más.

### `prueba` — testimonios

```json
"prueba": {
  "activa": false,
  "items": []
}
```

Viene apagada a propósito. Cuando tengas testimonios **reales**, ponla en `true` y agrégalos:

```json
"prueba": {
  "activa": true,
  "items": [
    { "texto": "En la primera sesión salí con el plan que llevaba meses posponiendo.", "autor": "Laura M., dueña de tienda" }
  ]
}
```

> Nunca inventes testimonios. Además de ser mentira, se nota: la gente los reconoce y pierdes
> la venta que ibas a ganar.

---

## 5. `agenda` — cuándo atiendes

```json
"agenda": {
  "zonaHoraria": "America/Mexico_City",
  "dias": [1, 2, 3, 4, 5],
  "horaInicio": "10:00",
  "horaFin": "18:00",
  "duracionMinutos": 30,
  "anticipacionHoras": 12,
  "diasAdelante": 14
}
```

### `dias` — los días que abres

Se escriben con números, **empezando en domingo**:

| Número | Día |
| --- | --- |
| `0` | domingo |
| `1` | lunes |
| `2` | martes |
| `3` | miércoles |
| `4` | jueves |
| `5` | viernes |
| `6` | sábado |

Ejemplos:

```json
"dias": [1, 2, 3, 4, 5]      // lunes a viernes
"dias": [1, 3, 5]            // lunes, miércoles y viernes
"dias": [2, 4, 6]            // martes, jueves y sábado
"dias": [6]                  // solo sábados
```

### `horaInicio` y `horaFin`

En formato de 24 horas, siempre con dos dígitos: `"09:00"`, `"14:30"`, `"19:00"`.
El último espacio que se ofrece es el que **termina** en `horaFin`. Con `horaFin: "18:00"`
y espacios de 30 minutos, el último empieza a las 17:30.

### `duracionMinutos`

De cuánto es cada espacio: `20`, `30`, `45`, `60`. Con esto se parte tu día completo.
No hay descansos entre citas: si quieres respiro, usa espacios de 45 para sesiones de 30.

### `anticipacionHoras` — con cuánto tiempo te pueden apartar

Es la clave que más se olvida y la que más molestias evita. Es el mínimo de horas entre
*ahorita* y la cita más próxima que alguien puede tomar.

| Valor | Qué pasa |
| --- | --- |
| `2` | Te pueden apartar para dentro de dos horas. Bueno para servicios de urgencia. |
| `12` | Nadie te aparta para hoy en la tarde si son las 10 de la mañana. Equilibrado. |
| `24` | Siempre tienes un día completo de aviso. |
| `48` | Para agendas que se planean con calma. |

### `diasAdelante` — qué tan lejos se puede reservar

`14` significa que la persona ve dos semanas de horarios. Ponerlo muy alto (`90`) hace que
la gente aparte para dentro de tres meses y no llegue. Entre `7` y `21` funciona mejor.

### `zonaHoraria`

Se usa para que la cita quede a la hora correcta cuando la persona la guarda en su Google
Calendar o en su iPhone. Escríbela tal cual:

- `America/Mexico_City`
- `America/Monterrey`
- `America/Tijuana`
- `America/Bogota`
- `America/Lima`
- `America/Argentina/Buenos_Aires`
- `America/Los_Angeles`
- `America/New_York`

> **Un detalle honesto:** los horarios que ve la persona se calculan con el reloj de su
> propio dispositivo. Si atiendes solo a gente de tu ciudad, no notarás nada. Si te agenda
> alguien de otro país, confirma la hora por WhatsApp antes de darla por buena.

---

## 6. `formulario` — qué le preguntas al reservar

```json
"formulario": {
  "campos": [
    { "id": "nombre", "etiqueta": "¿Cómo te llamas?", "tipo": "texto", "requerido": true },
    { "id": "whatsapp", "etiqueta": "Tu WhatsApp (con lada)", "tipo": "tel", "requerido": true },
    { "id": "correo", "etiqueta": "Tu correo", "tipo": "correo", "requerido": false }
  ]
}
```

| Llave | Qué es |
| --- | --- |
| `id` | El nombre interno del campo. Sin espacios, sin acentos, todo en minúsculas. |
| `etiqueta` | La pregunta que ve la persona. Escríbela como si se la dijeras de frente. |
| `tipo` | Qué clase de dato es. Ver la tabla de abajo. |
| `requerido` | `true` = no puede reservar sin llenarlo. `false` = es opcional. |

Tipos disponibles:

| Tipo | Para qué |
| --- | --- |
| `"texto"` | Un renglón: nombre, negocio, colonia. |
| `"tel"` | Teléfono. En el celular abre el teclado numérico. |
| `"correo"` | Correo. Revisa que traiga arroba. |
| `"parrafo"` | Caja grande, para que se explayen. |
| `"opciones"` | Lista para elegir. Requiere la llave `opciones`. |

Ejemplo de `opciones`:

```json
{
  "id": "presupuesto",
  "etiqueta": "¿Qué presupuesto tienes en mente?",
  "tipo": "opciones",
  "requerido": true,
  "opciones": ["Menos de $2 millones", "Entre $2 y $4 millones", "Más de $4 millones"]
}
```

> **No cambies estos dos `id`: `nombre` y `whatsapp`.**
> El sistema los usa para armar el mensaje de WhatsApp y para que puedas darle seguimiento
> a la persona desde tu tablero con un toque. Puedes cambiar la `etiqueta` todo lo que
> quieras, pero el `id` déjalo igual. Todos los demás campos son libres.

**Menos campos, más citas.** Cada pregunta que agregas tumba reservaciones. Tres o cuatro
es la medida. Lo demás lo preguntas en la sesión.

---

## 7. `gracias` — la pantalla de confirmación

```json
"gracias": {
  "titulo": "Listo, tu lugar está apartado",
  "mensaje": "Te espero puntual. Guarda la cita en tu calendario y mándame el aviso por WhatsApp para confirmarte.",
  "pasos": [
    "Manda el mensaje de WhatsApp (es un toque, ya va escrito)",
    "Agrega la cita a tu calendario",
    "Llega 2 minutos antes con una libreta"
  ]
}
```

Esta pantalla es la que hace que el sistema funcione: aquí la persona te manda el mensaje
con el código de cita. **Deja siempre el paso de mandar el WhatsApp como el primero de la
lista.** Si lo quitas o lo bajas, la gente se va sin avisarte y tú no te enteras de la cita.

---

## 8. `crm` — tu tablero de seguimiento

```json
"crm": {
  "pin": "1234",
  "etapas": [
    { "id": "nuevo", "nombre": "Nuevo" },
    { "id": "confirmado", "nombre": "Confirmada" },
    { "id": "atendido", "nombre": "Ya la tuve" },
    { "id": "ganado", "nombre": "Compró" },
    { "id": "perdido", "nombre": "No se dio" }
  ]
}
```

### `pin` — el candado del tablero

Es el número que te pide `/panel` para entrar. **Cámbialo antes de publicar.** El que viene
(`1234`) lo sabe cualquiera que lea este documento.

> **Lee esto con calma: el PIN no es una contraseña de verdad.**
> Como todo vive en el navegador y no hay servidor, el PIN viaja dentro de la página. Alguien
> con conocimientos técnicos puede verlo si se lo propone. Es un candado de puerta de
> recámara: sirve para que nadie entre por curiosidad o por accidente, no para detener a
> alguien decidido.
>
> Qué sí te protege de verdad: **no compartas la dirección `/panel`**. Nadie que no la
> conozca va a llegar ahí solo. Y recuerda que aunque alguien entrara, vería su propio
> tablero vacío: tus citas están en **tu** navegador, no en la página.
>
> Si vas a manejar información delicada (datos de salud, información financiera), este no es
> el sistema. Necesitas una base de datos con cuentas de verdad.

### `etapas` — por dónde pasa cada persona

`id` es el nombre interno (minúsculas, sin espacios) y `nombre` es lo que ves en el tablero.
La primera etapa de la lista es donde cae toda cita nueva; déjala como la entrada natural.

Puedes tener las que quieras, pero con más de seis el tablero se vuelve estorboso. Ejemplos
por giro:

```json
// Clínica
"etapas": [
  { "id": "nuevo", "nombre": "Agendado" },
  { "id": "confirmado", "nombre": "Confirmado" },
  { "id": "atendido", "nombre": "Ya vino" },
  { "id": "tratamiento", "nombre": "En tratamiento" },
  { "id": "perdido", "nombre": "No llegó" }
]

// Inmobiliaria
"etapas": [
  { "id": "nuevo", "nombre": "Interesado" },
  { "id": "confirmado", "nombre": "Visita agendada" },
  { "id": "atendido", "nombre": "Ya visitó" },
  { "id": "oferta", "nombre": "Hizo oferta" },
  { "id": "ganado", "nombre": "Cerrado" },
  { "id": "perdido", "nombre": "Se cayó" }
]
```

---

## 9. `integraciones` — el aviso automático (opcional)

```json
"integraciones": {
  "webhookUrl": ""
}
```

Déjalo vacío y no pasa nada: el sistema funciona igual. Si le pones una dirección de Make,
Zapier, n8n o Google Apps Script, cada vez que alguien aparte una cita se le manda esta
información:

```json
{
  "negocio": "Tu Negocio",
  "cita": {
    "id": "M8K2P4XQ",
    "inicio": "2026-09-02T11:00",
    "duracionMinutos": 30,
    "origen": "landing",
    "nombre": "Laura Martínez",
    "whatsapp": "3312345678",
    "correo": "laura@ejemplo.com"
  }
}
```

Dentro de `cita` aparecen también todas las respuestas de tu formulario, con el `id` de cada
campo como nombre. Con eso puedes guardar la cita en una hoja de Google, mandarte un correo
o avisarle a tu asistente sin pegar códigos a mano.

Si la dirección falla o está caída, **la cita se guarda igual**. La reservación nunca depende
de la automatización.

---

# Tres ejemplos completos

Copia el que se parezca a lo tuyo y cámbiale los datos.

## Ejemplo 1 — Consultoría de negocios

Atiende lunes a viernes, sesiones de 45 minutos, quiere calificar por facturación.

```json
{
  "negocio": {
    "nombre": "Ramírez Consultoría",
    "logoTexto": "RC",
    "whatsapp": "5213311112222",
    "correo": "hola@ramirezconsultoria.com",
    "ciudad": "Guadalajara, México",
    "sitio": "https://ramirezconsultoria.com"
  },
  "marca": { "colorPrincipal": "#E9C36A", "colorAcento": "#6FE3FF", "modo": "oscuro" },
  "oferta": {
    "nombre": "Diagnóstico de crecimiento",
    "duracionMinutos": 45,
    "precioTexto": "Sin costo la primera vez",
    "incluye": [
      "Revisamos tus números de los últimos 3 meses",
      "Identificamos el cuello de botella que te está frenando",
      "Sales con las 3 acciones que mueven la aguja este mes"
    ]
  },
  "landing": {
    "titular": "Tu negocio factura, pero no crece",
    "subtitular": "45 minutos para encontrar qué te está frenando y qué hacer primero.",
    "ctaTexto": "Quiero mi diagnóstico",
    "urgencia": "Tomo 6 diagnósticos al mes.",
    "dolores": [
      { "titulo": "Trabajas más y ganas igual", "texto": "Cada año metes más horas y la utilidad no se mueve." },
      { "titulo": "Tu equipo depende de ti para todo", "texto": "Si te vas una semana, el negocio se detiene." },
      { "titulo": "No sabes qué mover primero", "texto": "Tienes 20 ideas y ningún orden." }
    ],
    "beneficios": [
      { "titulo": "Claridad en 45 minutos", "texto": "Salimos con el problema real identificado, no con una lista de pendientes." },
      { "titulo": "Un solo siguiente paso", "texto": "Te digo qué hacer esta semana, no en seis meses." },
      { "titulo": "Sin compromiso de compra", "texto": "Si no hay cómo ayudarte, te lo digo en la sesión." }
    ],
    "paraQuien": [
      "Facturas más de $1 millón al año",
      "Tienes al menos 3 personas en el equipo",
      "Estás dispuesto a mover cosas, no solo a escuchar"
    ],
    "noParaQuien": [
      "Vas empezando y todavía no tienes ventas",
      "Buscas que alguien te haga el trabajo",
      "Solo quieres una segunda opinión gratis"
    ],
    "preguntas": [
      { "p": "¿Es una llamada de ventas disfrazada?", "r": "No. Es un diagnóstico real. Si al final tiene sentido trabajar juntos, te lo propongo; si no, te vas con tu plan." },
      { "p": "¿Necesito llevar mis números?", "r": "Ayuda mucho. Con ventas y utilidad de los últimos 3 meses es suficiente." },
      { "p": "¿Es presencial?", "r": "Por videollamada. Te mando la liga al confirmar." }
    ],
    "prueba": { "activa": false, "items": [] }
  },
  "agenda": {
    "zonaHoraria": "America/Mexico_City",
    "dias": [1, 2, 3, 4, 5],
    "horaInicio": "09:00",
    "horaFin": "18:00",
    "duracionMinutos": 45,
    "anticipacionHoras": 24,
    "diasAdelante": 14
  },
  "formulario": {
    "campos": [
      { "id": "nombre", "etiqueta": "¿Cómo te llamas?", "tipo": "texto", "requerido": true },
      { "id": "whatsapp", "etiqueta": "Tu WhatsApp (con lada)", "tipo": "tel", "requerido": true },
      { "id": "correo", "etiqueta": "Tu correo", "tipo": "correo", "requerido": true },
      { "id": "facturacion", "etiqueta": "¿Cuánto factura tu negocio al año?", "tipo": "opciones", "requerido": true, "opciones": ["Menos de $1 millón", "Entre $1 y $5 millones", "Entre $5 y $20 millones", "Más de $20 millones"] },
      { "id": "reto", "etiqueta": "¿Qué quieres resolver?", "tipo": "parrafo", "requerido": false }
    ]
  },
  "gracias": {
    "titulo": "Listo, tu diagnóstico está apartado",
    "mensaje": "Te espero puntual. Manda el WhatsApp para que te confirme y te pase la liga de la videollamada.",
    "pasos": [
      "Manda el mensaje de WhatsApp (ya va escrito)",
      "Agrega la cita a tu calendario",
      "Ten a la mano tus ventas de los últimos 3 meses"
    ]
  },
  "crm": {
    "pin": "7391",
    "etapas": [
      { "id": "nuevo", "nombre": "Nuevo" },
      { "id": "confirmado", "nombre": "Confirmada" },
      { "id": "atendido", "nombre": "Ya la tuve" },
      { "id": "propuesta", "nombre": "Propuesta enviada" },
      { "id": "ganado", "nombre": "Contrató" },
      { "id": "perdido", "nombre": "No se dio" }
    ]
  },
  "integraciones": { "webhookUrl": "" }
}
```

## Ejemplo 2 — Clínica dental

Atiende de martes a sábado, valoraciones de 20 minutos, necesita saber qué le duele al
paciente antes de que llegue.

```json
{
  "negocio": {
    "nombre": "Dental Aurora",
    "logoTexto": "DA",
    "whatsapp": "5218112223333",
    "correo": "citas@dentalaurora.mx",
    "ciudad": "Monterrey, México",
    "sitio": "https://dentalaurora.mx"
  },
  "marca": { "colorPrincipal": "#6FE3FF", "colorAcento": "#8FE6C0", "modo": "oscuro" },
  "oferta": {
    "nombre": "Valoración dental",
    "duracionMinutos": 20,
    "precioTexto": "Sin costo",
    "incluye": [
      "Revisión completa con el doctor",
      "Te explicamos qué tienes y qué urge de verdad",
      "Presupuesto por escrito antes de que te vayas"
    ]
  },
  "landing": {
    "titular": "Deja de posponer esa muela",
    "subtitular": "20 minutos de valoración sin costo para saber exactamente qué necesitas y cuánto cuesta.",
    "ctaTexto": "Aparto mi valoración",
    "urgencia": "Abrimos 10 valoraciones sin costo por semana.",
    "dolores": [
      { "titulo": "Te da miedo lo que te vayan a decir", "texto": "Prefieres no saber antes que enterarte del costo." },
      { "titulo": "Ya te dieron precios que no cuadran", "texto": "Cada clínica te dice algo distinto y ninguna te explica por qué." },
      { "titulo": "El dolor va y viene", "texto": "Aguantas con pastillas y lo dejas pasar otro mes." }
    ],
    "beneficios": [
      { "titulo": "Te decimos la verdad", "texto": "Qué urge, qué puede esperar y qué no necesitas hacerte." },
      { "titulo": "Presupuesto por escrito", "texto": "Sales con los costos claros, sin sorpresas después." },
      { "titulo": "Sin presión para tratarte hoy", "texto": "Decides en tu casa, con la información en la mano." }
    ],
    "paraQuien": [
      "Traes una molestia y quieres saber qué es",
      "Te dieron un presupuesto y quieres una segunda opinión",
      "Llevas más de un año sin revisión"
    ],
    "noParaQuien": [
      "Vienes con una urgencia de este momento (háblanos por teléfono)",
      "Buscas solo limpieza sin revisión"
    ],
    "preguntas": [
      { "p": "¿La valoración de verdad no cuesta?", "r": "No cuesta. Incluye revisión y presupuesto por escrito." },
      { "p": "¿Me tratan el mismo día?", "r": "Si el caso lo permite y tú quieres, sí. Nunca te presionamos." },
      { "p": "¿Aceptan tarjeta?", "r": "Sí, tarjeta, transferencia y meses sin intereses desde cierto monto." },
      { "p": "¿Dónde estacionamos?", "r": "Tenemos estacionamiento propio en el mismo edificio." }
    ],
    "prueba": { "activa": false, "items": [] }
  },
  "agenda": {
    "zonaHoraria": "America/Monterrey",
    "dias": [2, 3, 4, 5, 6],
    "horaInicio": "10:00",
    "horaFin": "19:00",
    "duracionMinutos": 20,
    "anticipacionHoras": 12,
    "diasAdelante": 10
  },
  "formulario": {
    "campos": [
      { "id": "nombre", "etiqueta": "¿Cómo te llamas?", "tipo": "texto", "requerido": true },
      { "id": "whatsapp", "etiqueta": "Tu WhatsApp (con lada)", "tipo": "tel", "requerido": true },
      { "id": "motivo", "etiqueta": "¿Qué te trae con nosotros?", "tipo": "opciones", "requerido": true, "opciones": ["Me duele algo", "Revisión general", "Ortodoncia (frenos)", "Blanqueamiento", "Segunda opinión"] },
      { "id": "primeravez", "etiqueta": "¿Es tu primera vez en la clínica?", "tipo": "opciones", "requerido": false, "opciones": ["Sí", "No, ya soy paciente"] }
    ]
  },
  "gracias": {
    "titulo": "Tu valoración quedó apartada",
    "mensaje": "Te esperamos. Manda el WhatsApp para confirmarte el consultorio y la ubicación exacta.",
    "pasos": [
      "Manda el mensaje de WhatsApp (ya va escrito)",
      "Agrega la cita a tu calendario",
      "Llega 10 minutos antes para tu registro"
    ]
  },
  "crm": {
    "pin": "4820",
    "etapas": [
      { "id": "nuevo", "nombre": "Agendado" },
      { "id": "confirmado", "nombre": "Confirmado" },
      { "id": "atendido", "nombre": "Ya vino" },
      { "id": "tratamiento", "nombre": "En tratamiento" },
      { "id": "perdido", "nombre": "No llegó" }
    ]
  },
  "integraciones": { "webhookUrl": "" }
}
```

## Ejemplo 3 — Inmobiliaria

Atiende todos los días incluyendo domingo, visitas de una hora, necesita calificar
presupuesto y forma de pago antes de mover al asesor.

```json
{
  "negocio": {
    "nombre": "Cumbres Propiedades",
    "logoTexto": "CP",
    "whatsapp": "5215544445555",
    "correo": "asesores@cumbrespropiedades.com",
    "ciudad": "Ciudad de México",
    "sitio": "https://cumbrespropiedades.com"
  },
  "marca": { "colorPrincipal": "#C9A227", "colorAcento": "#E8E3D8", "modo": "oscuro" },
  "oferta": {
    "nombre": "Visita guiada",
    "duracionMinutos": 60,
    "precioTexto": "Sin costo y sin compromiso",
    "incluye": [
      "Recorrido completo con un asesor, no con un vigilante",
      "Números reales: enganche, mensualidad y gastos de escrituración",
      "Te decimos si calificas antes de que gastes tiempo"
    ]
  },
  "landing": {
    "titular": "Conoce tu próxima casa este fin de semana",
    "subtitular": "Aparta una visita de una hora con un asesor que sí te dice los números completos.",
    "ctaTexto": "Aparto mi visita",
    "urgencia": "Quedan 4 unidades en la etapa actual.",
    "dolores": [
      { "titulo": "Los anuncios nunca dicen el precio real", "texto": "Preguntas y te contestan con otra pregunta." },
      { "titulo": "Te hacen perder el sábado", "texto": "Llegas y la propiedad ya estaba apartada o no era la de las fotos." },
      { "titulo": "No sabes si vas a calificar", "texto": "Te ilusionas y hasta el final te dicen que no." }
    ],
    "beneficios": [
      { "titulo": "Números por delante", "texto": "Enganche, mensualidad y gastos, desde la primera conversación." },
      { "titulo": "Visita con hora apartada", "texto": "Llegas y te están esperando. Nadie más va a estar recorriendo contigo." },
      { "titulo": "Precalificación antes de la visita", "texto": "Si no calificas hoy, te decimos qué falta para que califiques." }
    ],
    "paraQuien": [
      "Buscas casa para vivir o para invertir",
      "Tienes enganche disponible o crédito preautorizado",
      "Puedes decidir tú (o vienes con quien decide)"
    ],
    "noParaQuien": [
      "Solo quieres ver por curiosidad",
      "Buscas renta, no compra",
      "Todavía no tienes nada de enganche"
    ],
    "preguntas": [
      { "p": "¿La visita cuesta o compromete?", "r": "Ninguna de las dos. Es un recorrido con asesor y te vas cuando quieras." },
      { "p": "¿Puedo llevar a mi pareja o a mi familia?", "r": "Claro. Es mejor que vengan quienes van a decidir." },
      { "p": "¿Trabajan con Infonavit o Fovissste?", "r": "Sí, y también con crédito bancario y cofinanciamiento. Lo revisamos en la visita." },
      { "p": "¿Y si llueve o no puedo ese día?", "r": "Nos avisas por WhatsApp y lo movemos sin problema." }
    ],
    "prueba": { "activa": false, "items": [] }
  },
  "agenda": {
    "zonaHoraria": "America/Mexico_City",
    "dias": [0, 1, 2, 3, 4, 5, 6],
    "horaInicio": "10:00",
    "horaFin": "18:00",
    "duracionMinutos": 60,
    "anticipacionHoras": 6,
    "diasAdelante": 21
  },
  "formulario": {
    "campos": [
      { "id": "nombre", "etiqueta": "¿Cómo te llamas?", "tipo": "texto", "requerido": true },
      { "id": "whatsapp", "etiqueta": "Tu WhatsApp (con lada)", "tipo": "tel", "requerido": true },
      { "id": "correo", "etiqueta": "Tu correo", "tipo": "correo", "requerido": false },
      { "id": "presupuesto", "etiqueta": "¿Qué presupuesto tienes en mente?", "tipo": "opciones", "requerido": true, "opciones": ["Menos de $2 millones", "Entre $2 y $4 millones", "Entre $4 y $8 millones", "Más de $8 millones"] },
      { "id": "pago", "etiqueta": "¿Cómo piensas pagarla?", "tipo": "opciones", "requerido": true, "opciones": ["Crédito bancario", "Infonavit o Fovissste", "Contado", "Todavía no lo sé"] },
      { "id": "zona", "etiqueta": "¿Qué zona te interesa?", "tipo": "texto", "requerido": false }
    ]
  },
  "gracias": {
    "titulo": "Tu visita está apartada",
    "mensaje": "Un asesor te va a estar esperando. Manda el WhatsApp para confirmarte la dirección exacta y cómo llegar.",
    "pasos": [
      "Manda el mensaje de WhatsApp (ya va escrito)",
      "Agrega la visita a tu calendario",
      "Trae identificación para el acceso al desarrollo"
    ]
  },
  "crm": {
    "pin": "6145",
    "etapas": [
      { "id": "nuevo", "nombre": "Interesado" },
      { "id": "confirmado", "nombre": "Visita agendada" },
      { "id": "atendido", "nombre": "Ya visitó" },
      { "id": "oferta", "nombre": "Hizo oferta" },
      { "id": "ganado", "nombre": "Cerrado" },
      { "id": "perdido", "nombre": "Se cayó" }
    ]
  },
  "integraciones": { "webhookUrl": "" }
}
```

---

## Errores comunes

| Lo que ves | Casi siempre es |
| --- | --- |
| Pantalla en blanco | Una coma de más o de menos en `negocio.config.json`. |
| No aparece ningún horario | `dias` está vacío, `horaFin` es antes que `horaInicio`, o `anticipacionHoras` es tan alto que ya no cabe ninguna cita en `diasAdelante`. |
| El botón de WhatsApp no abre tu chat | El número trae `+`, espacios o guiones, o le falta la lada de país. |
| El nombre no sale en el mensaje | Le cambiaste el `id` al campo `nombre`. Regrésalo a `nombre`. |
| No puedes escribirle a la persona desde el tablero | Le cambiaste el `id` al campo `whatsapp`. Regrésalo a `whatsapp`. |

Cuando termines de personalizar, sigue con [PUBLICAR.md](PUBLICAR.md).
