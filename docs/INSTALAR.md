# Instalar

Hay dos caminos. Los dos llegan al mismo lugar.

- **Camino A — sin instalar nada.** Todo desde el navegador. Es el recomendado si nunca has
  usado GitHub. Toma unos 10 minutos.
- **Camino B — en tu computadora.** Para ver los cambios en vivo antes de publicarlos. Toma
  unos 20 minutos la primera vez.

Puedes empezar por el A y hacer el B después. No te encierras en ninguno.

---

## Camino A — sin instalar nada

### 1. Haz tu propia copia del proyecto

1. Crea tu cuenta gratis en [github.com](https://github.com) si aún no tienes una.
2. Entra a **github.com/m4nueldeleon/sistema-de-citas**.
3. **Inicia sesión en GitHub antes de seguir.** El botón del siguiente paso solo aparece
   cuando ya entraste a tu cuenta: si estás como visitante, la página se ve completa pero
   sin ese botón. Es la confusión más común.
4. Ya con tu sesión abierta, arriba a la derecha aparece el botón verde **Use this
   template**. Apriétalo y luego **Create a new repository**.
   - Si aun así no lo ves, aprieta **Fork** (está en la misma fila, arriba a la derecha) y
   luego **Create fork**. Sirve igual.
5. En **Repository name** escribe un nombre sin espacios, por ejemplo `citas-mi-negocio`.
6. Déjalo en **Public** (o **Private** si prefieres, funciona igual).
7. Aprieta **Create repository**.

Ya tienes tu copia. La dirección se ve así:
`github.com/TU-USUARIO/citas-mi-negocio`

### 2. Publícalo en internet

1. Crea tu cuenta gratis en [vercel.com](https://vercel.com). Cuando te pregunte cómo
   quieres entrar, elige **Continue with GitHub**. Así se conectan solas las dos cuentas.
2. En Vercel aprieta **Add New…** y luego **Project**.
3. Te aparece la lista de tus repositorios de GitHub. Busca el tuyo
   (`citas-mi-negocio`) y aprieta **Import**.
   - Si no aparece, aprieta **Adjust GitHub App Permissions** y dale acceso al
     repositorio.
4. No cambies nada de lo que te muestra. Aprieta **Deploy**.
5. Espera entre uno y dos minutos. Cuando termine verás una pantalla de felicitación con
   una dirección tipo `citas-mi-negocio.vercel.app`.

Ábrela. Ya está viva tu página con los textos de ejemplo.

El paso completo con dominio propio está en [PUBLICAR.md](PUBLICAR.md).

### 3. Ponle lo tuyo

1. Regresa a tu repositorio en GitHub.
2. Aprieta el archivo **`negocio.config.json`**.
3. Arriba a la derecha del archivo, aprieta el ícono del lápiz (**Edit this file**).
4. Cambia los textos que están entre comillas. La guía completa está en
   [PERSONALIZAR.md](PERSONALIZAR.md).
5. Baja hasta el final y aprieta el botón verde **Commit changes…** y otra vez
   **Commit changes**.
6. Vercel se da cuenta solo y vuelve a publicar. En un minuto tu página ya tiene tus datos.

Listo. Ya tienes sistema de citas.

---

## Camino B — en tu computadora

Sirve para ver los cambios al instante mientras los haces, sin publicar cada prueba.

### 1. Instala Node.js

Node es el motor que hace correr el proyecto en tu computadora.

1. Entra a [nodejs.org](https://nodejs.org).
2. Descarga la versión que dice **LTS** (necesitas la 20 o más nueva).
3. Instálala como cualquier programa: siguiente, siguiente, aceptar.
4. Reinicia la Terminal si la tenías abierta.

Para comprobar que quedó, abre la Terminal (en Mac: Spotlight → escribe *Terminal*; en
Windows: menú de inicio → *Símbolo del sistema*) y escribe:

```bash
node --version
```

Debe responder algo como `v20.11.0` o mayor.

### 2. Descarga tu copia del proyecto

Primero haz tu copia en GitHub (paso 1 del Camino A). Luego, en la Terminal:

```bash
git clone https://github.com/TU-USUARIO/citas-mi-negocio.git
cd citas-mi-negocio
```

Cambia `TU-USUARIO` y `citas-mi-negocio` por los tuyos.

> Si `git` no está instalado, en Mac la Terminal te ofrece instalarlo sola; acepta. En
> Windows, descárgalo de [git-scm.com](https://git-scm.com) e instálalo.
>
> Alternativa sin `git`: en tu repositorio de GitHub aprieta el botón verde **Code** y
> luego **Download ZIP**. Descomprime la carpeta y entra a ella desde la Terminal.

### 3. Instala las piezas del proyecto

```bash
npm install
```

Tarda uno o dos minutos y suelta mucho texto. Es normal.

> Si usas `pnpm`, corre `pnpm install`. El proyecto trae el archivo `pnpm-lock.yaml`, así
> que con `pnpm` la instalación es más rápida. Con `npm` funciona igual de bien.

### 4. Enciéndelo

```bash
npm run dev
```

Cuando veas un mensaje con `http://localhost:3000`, abre esa dirección en tu navegador. Ahí
está tu página.

Deja esa ventana de la Terminal abierta mientras trabajas. Cada vez que guardes un cambio
en `negocio.config.json`, la página se actualiza sola.

Para apagarlo: en la Terminal aprieta `Ctrl` + `C`.

### 5. Sube tus cambios

Cuando ya te guste cómo quedó:

```bash
git add .
git commit -m "Mis datos"
git push
```

Vercel lo publica solo en menos de dos minutos.

---

## Si algo falla

### "El puerto 3000 ya está en uso" / *Port 3000 is already in use*

Ya tienes el proyecto corriendo en otra ventana de la Terminal. Ciérrala, o levántalo en
otro puerto:

```bash
npm run dev -- -p 3001
```

Y abre `http://localhost:3001`.

### "npm no se reconoce como comando" / *command not found: npm*

No quedó instalado Node.js, o no reiniciaste la Terminal después de instalarlo. Cierra la
Terminal por completo, vuelve a abrirla y prueba `node --version`. Si sigue fallando,
reinstala Node.js desde [nodejs.org](https://nodejs.org) y reinicia la computadora.

### Pantalla en blanco al abrir localhost:3000

1. Revisa la Terminal: si hay un error en rojo, casi siempre dice el archivo y el renglón.
2. Lo más común es una coma de más o de menos en `negocio.config.json`. Abre el archivo y
   revisa que cada renglón termine en coma **menos el último** de cada bloque.
3. Si no encuentras el error, deshaz tus cambios y empieza de nuevo desde el archivo
   original:

```bash
git checkout negocio.config.json
```

### El navegador dice que la página no existe

Asegúrate de escribir `http://localhost:3000` (con `http://`, no `https://`) y de que la
Terminal siga corriendo el proyecto.

### La publicación en Vercel falló

Entra al proyecto en Vercel, aprieta **Deployments**, abre el último y lee el texto en
rojo. En 9 de cada 10 casos es una coma mal puesta en `negocio.config.json`. Corrígela en
GitHub, haz **Commit changes** y Vercel lo vuelve a intentar solo.

### Sigo atorado

Abre una petición de ayuda en el repositorio original: pestaña **Issues** → **New issue** →
plantilla **Necesito ayuda**. Cuéntanos qué apretaste y qué te salió.
