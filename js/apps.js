/*
 * ─────────────────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN DEL MENÚ
 *  Es el único fichero que tienes que tocar para añadir, quitar o reordenar
 *  aplicaciones y juegos. Se muestran en el mismo orden en que aparecen aquí.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Campos de cada entrada:
 *
 *    nombre        (obligatorio) Texto que se muestra.
 *    url           (obligatorio) A dónde lleva al pulsar. Admite:
 *                    - Ruta absoluta del mismo dominio: "/nombre-del-repo/"
 *                      (recomendado si todo está en tu-usuario.github.io)
 *                    - URL completa: "https://tu-usuario.github.io/repo/"
 *                  Solo se aceptan http(s) y rutas; cualquier otra cosa
 *                  (javascript:, data:…) se descarta.
 *    descripcion   Una o dos frases. Se recorta a 4 líneas.
 *    icono         Puede ser:
 *                    - Un emoji:            "🎲"
 *                    - Una o dos letras:    "WL"
 *                    - Una imagen:          "img/iconos/mi-juego.png"
 *                      (png, jpg, svg, webp, gif o una URL https)
 *                  Si lo dejas vacío se usa la inicial del nombre.
 *    tipo          Clave de una de las categorías de abajo ("juego", "app").
 *    etiquetas     Palabras extra para el buscador: ["estrategia", "2 jugadores"]
 *    nuevaPestana  true → se abre en otra pestaña.
 *    oculto        true → no se muestra, pero la entrada queda guardada.
 */

window.MENU = {
  sitio: {
    titulo: "Mis aplicaciones y juegos",
    subtitulo: "Elige uno para abrirlo.",
    autor: "ElCyberCurioso",
    // Enlace del pie. Déjalo vacío ("") para no mostrarlo.
    github: "",
  },

  // Cada categoría define el texto de su filtro y su color.
  // Puedes añadir más (por ejemplo, herramienta: {...}) y usarlas en "tipo".
  categorias: {
    juego: { nombre: "Juegos", singular: "Juego", color: "#D23369" },
    app: { nombre: "Aplicaciones", singular: "Aplicación", color: "#2552D0" },
  },

  apps: [
    // ── Juegos ───────────────────────────────────────────────────────────
    {
      nombre: "Poker",
      descripcion:
        "Texas Hold'em con fichas ficticias: mesas contra bots, salas privadas con amigos, torneos Sit & Go y una academia para aprender.",
      url: "/poker/",
      icono: "img/iconos/poker.svg",
      tipo: "juego",
      etiquetas: ["póquer", "cartas", "texas hold'em", "multijugador", "bots"],
    },
    {
      nombre: "DungeonMess",
      descripcion:
        "Roguelike incremental de mazmorras: armas a una y dos manos, árbol de habilidades y enemigos cada vez más fuertes.",
      url: "/dungeonmess/",
      icono: "img/iconos/dungeonmess.svg",
      tipo: "juego",
      etiquetas: ["roguelike", "rpg", "incremental", "mazmorras"],
    },
    {
      nombre: "Bomber",
      descripcion:
        "Juego de bombas multijugador: salas públicas y privadas, habilidades y cinco modos de juego.",
      url: "/bomber/",
      icono: "img/iconos/bomber.svg",
      tipo: "juego",
      etiquetas: ["bomberman", "multijugador", "online", "salas"],
    },
    {
      nombre: "JMate",
      descripcion:
        "Ajedrez contra la máquina, con amigos o con desconocidos. Analiza tus partidas y entrena aperturas, sin registro.",
      url: "/jmate/",
      icono: "img/iconos/jmate.svg",
      tipo: "juego",
      etiquetas: ["ajedrez", "chess", "aperturas", "multijugador", "bots"],
    },
    {
      nombre: "WarLord",
      descripcion:
        "Tanques multijugador online: seis clases con habilidades, seis modos de juego y salas públicas o privadas.",
      url: "/warlord/",
      icono: "img/iconos/warlord.svg",
      tipo: "juego",
      etiquetas: ["tanques", "multijugador", "online", "salas"],
    },
    {
      nombre: "WordCrash",
      descripcion:
        "Mecanografía arcade: las palabras caen y un láser las desintegra al terminar de escribirlas. Seis idiomas y cuatro modos.",
      url: "/wordcrash/",
      icono: "img/iconos/wordcrash.svg",
      tipo: "juego",
      etiquetas: ["mecanografía", "teclear", "escribir", "typing", "idiomas"],
    },
    {
      nombre: "Snake Joystick",
      descripcion:
        "Snake arcade con joystick táctil, cinco personajes, cazadores que te persiguen y habilidades que mejoran con cada nivel.",
      url: "/snake/",
      icono: "img/iconos/snake.svg",
      tipo: "juego",
      etiquetas: ["serpiente", "arcade", "móvil", "joystick"],
    },

    // ── Aplicaciones ─────────────────────────────────────────────────────
    {
      nombre: "Fretto",
      descripcion:
        "Curso interactivo de teoría musical para guitarra: acordes, escalas, ritmo, tablatura y partitura, con diapasón, metrónomo y afinador.",
      url: "/fretto/",
      icono: "img/iconos/fretto.svg",
      tipo: "app",
      etiquetas: ["guitarra", "música", "teoría musical", "acordes", "escalas"],
    },
    {
      nombre: "Pomodoro",
      descripcion:
        "Temporizador Pomodoro con música de YouTube de fondo, tareas y estadísticas. Personalizable y sin registro.",
      url: "/pomodoro/",
      icono: "img/iconos/pomodoro.svg",
      tipo: "app",
      etiquetas: ["temporizador", "productividad", "concentración", "música", "tareas"],
    },
    {
      nombre: "PDF Manager",
      descripcion:
        "Une, divide, comprime, rota, marca y protege PDFs en el navegador, sin subir archivos a ningún servidor.",
      url: "/pdfManager/",
      icono: "img/iconos/pdfmanager.svg",
      tipo: "app",
      etiquetas: ["pdf", "documentos", "unir", "combinar", "comprimir", "dividir"],
    },
  ],
};
