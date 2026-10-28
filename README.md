# Menú de aplicaciones y juegos

Página estática para GitHub Pages que sirve de punto de entrada a tus aplicaciones y juegos. Sin dependencias ni paso de compilación: se sube tal cual.

## Estructura

```
index.html          Estructura de la página
css/estilos.css     Estilos (tema claro y oscuro)
js/apps.js          ← CONFIGURACIÓN: lo único que tienes que editar
js/app.js           Lógica: filtros, buscador, pintado de la lista
js/tema.js          Aplica el tema guardado antes de pintar
img/favicon.svg     Icono de la pestaña
img/iconos/         Iconos de tus aplicaciones y juegos
.nojekyll           Evita que GitHub Pages procese el sitio con Jekyll
```

## Añadir una aplicación o un juego

Edita `js/apps.js` y añade un objeto al array `apps`. Se muestran en el mismo orden en que aparecen en el fichero.

```js
{
  nombre: "Mi juego",
  descripcion: "Una o dos frases sobre qué es.",
  url: "/mi-juego/",
  icono: "img/iconos/mi-juego.png",   // o un emoji "🎮", o letras "MJ"
  tipo: "juego",                       // "juego" o "app"
  etiquetas: ["estrategia"],           // opcional, para el buscador
  nuevaPestana: false,                 // opcional
  oculto: false,                       // opcional: true = no se muestra
},
```

| Campo | Obligatorio | Descripción |
|---|---|---|
| `nombre` | Sí | Texto que se muestra. |
| `url` | Sí | Destino al pulsar. Solo se aceptan `http(s)` y rutas; cualquier otro esquema se descarta. |
| `descripcion` | No | Se recorta a 4 líneas. |
| `icono` | No | Emoji, una o dos letras, o ruta/URL de imagen (png, jpg, svg, webp, gif). Vacío = inicial del nombre. |
| `tipo` | No | Clave de `categorias`. Decide el filtro y el color. |
| `etiquetas` | No | Palabras extra que encuentra el buscador. |
| `nuevaPestana` | No | `true` abre el enlace en otra pestaña. |
| `oculto` | No | `true` mantiene la entrada en el fichero sin mostrarla. |

Ahora mismo el menú incluye Poker, DungeonMess, Bomber, JMate, WarLord, WordCrash, Snake Joystick, Fretto, Accordio, Pomodoro, Converter, PDF Manager y Triángulo de Lectores. Se muestran en el orden del fichero: primero los juegos y después las aplicaciones.

### Bloque destacado

`destacado`, en `js/apps.js`, se muestra grande, encima de los filtros, y no le afectan ni los filtros ni el buscador. Ahora apunta a elcybercurioso.com. Admite los mismos campos que una entrada, más `boton` (texto del botón) y `color` (el de la sombra y el botón). Sobre el nombre se muestra el dominio de la URL. También acepta una lista de objetos si algún día quieres destacar más de uno. Para quitarlo, bórralo o ponle `oculto: true`.

### Categorías

En `categorias` se define el texto de cada filtro y su color. Puedes añadir más (por ejemplo `herramienta: { nombre: "Herramientas", singular: "Herramienta", color: "#0E7C66" }`) y usar su clave en `tipo`. Los filtros solo aparecen si hay al menos dos categorías con contenido.

### Iconos

Las imágenes rellenan la ficha entera, así que lo ideal es un icono cuadrado con su propio fondo (SVG o PNG de al menos 128×128 px), como el favicon de cada aplicación. Los iconos actuales son copias de los de cada repositorio y están en `img/iconos/`. Si cambias el icono de una aplicación, sustituye también su copia aquí.

Los emojis y las letras se muestran sobre una ficha tintada con el color de la categoría.

## Qué URL poner

Todas las páginas de GitHub Pages de una misma cuenta comparten dominio (`tu-usuario.github.io`), así que lo más cómodo es usar rutas absolutas del dominio:

- Repositorio `warlord` publicado en Pages → `url: "/warlord/"`
- Con dominio propio o fuera de tu cuenta → URL completa `https://…`

## Publicar en GitHub Pages

**Opción A: como página principal de tu cuenta** (`https://tu-usuario.github.io/`)

1. Crea un repositorio llamado exactamente `tu-usuario.github.io`.
2. Sube el contenido de esta carpeta a la raíz de la rama `main`.
3. En *Settings → Pages*, elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.

**Opción B: como un repositorio más** (`https://tu-usuario.github.io/menu/`)

1. Crea un repositorio, por ejemplo `menu`, y sube el contenido.
2. Mismo paso 3 que en la opción A.

En ambos casos las rutas tipo `/warlord/` siguen funcionando.

## Probar en local

Se puede abrir `index.html` directamente con doble clic. Para que las rutas `/repo/` se comporten igual que en GitHub Pages, mejor con un servidor:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Atajos de teclado

- `/` lleva al buscador.
- `Intro` en el buscador abre el primer resultado (aparece marcado).
- `Esc` borra la búsqueda.

## Seguridad

- La página incluye una Content-Security-Policy en `<meta>`: scripts y estilos solo propios (más Google Fonts), sin `connect-src`, sin `object-src`.
- Si en el futuro añades analítica o scripts externos, tendrás que ampliar esa política en `index.html`.
- Todo el contenido de `apps.js` se inserta con `textContent`, nunca como HTML, y las URL pasan por una lista blanca de esquemas.
- Los enlaces que se abren en otra pestaña llevan `rel="noopener noreferrer"`.
