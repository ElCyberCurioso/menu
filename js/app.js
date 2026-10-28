/*
 * Lógica del menú. Lee window.MENU (definido en js/apps.js) y pinta la lista.
 * No hace falta modificar este fichero para añadir aplicaciones o juegos.
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const raiz = document.documentElement;

  const lista = $("lista");
  const vacio = $("vacio");
  const filtrosEl = $("filtros");
  const controles = $("controles");
  const buscar = $("buscar");
  const estado = $("estado");
  const botonTema = $("boton-tema");

  iniciarTema();

  const config = window.MENU;
  if (!config || !Array.isArray(config.apps)) {
    controles.hidden = true;
    mostrarVacio(
      "No se ha podido leer js/apps.js.",
      "Comprueba que el fichero existe y que no tiene errores de sintaxis, como una coma o unas comillas de más. La consola del navegador indica la línea exacta."
    );
    return;
  }

  const sitio = config.sitio || {};
  const categorias = config.categorias || {};
  const COLOR_NEUTRO = "#6B7480";

  pintarCabecera();
  pintarPie();
  pintarDestacado();

  const apps = config.apps
    .map((entrada, i) => normalizar(entrada, i))
    .filter(Boolean);

  if (apps.length === 0) {
    controles.hidden = true;
    mostrarVacio(
      "Todavía no hay nada que mostrar.",
      "Añade tus aplicaciones y juegos en js/apps.js y aparecerán aquí."
    );
    return;
  }

  const nodos = new Map(apps.map((app, i) => [app.id, crearItem(app, i)]));
  let filtro = "todo";
  let visibles = apps;

  pintarFiltros();
  pintar({ anunciar: false });
  animarLlegada();
  conectarTeclado();

  /* ── Datos ─────────────────────────────────────────────────────────── */

  function normalizar(entrada, i) {
    if (!entrada || entrada.oculto) return null;

    const nombre = String(entrada.nombre || "").trim();
    const url = urlSegura(entrada.url);
    if (!nombre || !url) {
      console.warn(
        `[menú] Entrada ${i + 1} ignorada: necesita "nombre" y una "url" válida (http, https o una ruta).`,
        entrada
      );
      return null;
    }

    const tipo = String(entrada.tipo || "").trim();
    const cat = categorias[tipo] || {
      nombre: tipo || "Otros",
      singular: tipo || "Otro",
      color: COLOR_NEUTRO,
    };
    const descripcion = String(entrada.descripcion || "").trim();
    const etiquetas = Array.isArray(entrada.etiquetas) ? entrada.etiquetas.map(String) : [];

    return {
      id: `app-${i}`,
      nombre,
      descripcion,
      url,
      icono: String(entrada.icono || "").trim(),
      tipo,
      cat,
      nuevaPestana: entrada.nuevaPestana === true,
      texto: plano([nombre, descripcion, cat.nombre, cat.singular, ...etiquetas].join(" ")),
      giro: giroEstable(nombre),
    };
  }

  // Solo se aceptan http(s) y rutas relativas. En local (file://) también
  // se aceptan rutas del mismo protocolo para poder probar sin servidor.
  function urlSegura(valor) {
    if (typeof valor !== "string" || !valor.trim()) return null;
    try {
      const u = new URL(valor.trim(), document.baseURI);
      const permitido =
        u.protocol === "https:" || u.protocol === "http:" || u.protocol === location.protocol;
      return permitido ? u.href : null;
    } catch {
      return null;
    }
  }

  // Texto en minúsculas y sin tildes, para que "ajedrez" encuentre "Ajédrez".
  function plano(texto) {
    return String(texto).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  }

  // Inclinación de cada ficha: siempre la misma para el mismo nombre.
  function giroEstable(texto) {
    let h = 2166136261;
    for (const c of texto) {
      h ^= c.codePointAt(0);
      h = Math.imul(h, 16777619);
    }
    h >>>= 0;
    const grados = 1.4 + ((h % 1000) / 1000) * 2.8;
    return `${h & 1024 ? grados.toFixed(2) : (-grados).toFixed(2)}deg`;
  }

  /* ── Cabecera y pie ────────────────────────────────────────────────── */

  function pintarCabecera() {
    if (sitio.titulo) {
      $("titulo").textContent = sitio.titulo;
      document.title = sitio.titulo;
    }
    if (typeof sitio.subtitulo === "string") {
      $("subtitulo").textContent = sitio.subtitulo;
      $("subtitulo").hidden = !sitio.subtitulo;
    }
    $("autor").textContent = sitio.autor || "";
  }

  function pintarPie() {
    const pie = $("pie");
    const enlace = urlSegura(sitio.github);
    const partes = [];

    if (sitio.autor) partes.push(crear("span", "", `Hecho por ${sitio.autor}`));
    if (enlace) {
      const a = crear("a", "", "Código en GitHub");
      a.href = enlace;
      a.rel = "noopener";
      partes.push(a);
    }
    if (partes.length) {
      const fila = crear("div", "pie__fila");
      fila.append(...partes);
      pie.append(fila);
      pie.hidden = false;
    }
  }

  /* ── Destacado ─────────────────────────────────────────────────────── */

  // Admite un objeto o una lista de objetos en config.destacado.
  function pintarDestacado() {
    const contenedor = $("destacado");
    const entradas = [].concat(config.destacado || []).filter((d) => d && !d.oculto);

    entradas.forEach((d, i) => {
      const nombre = String(d.nombre || "").trim();
      const url = urlSegura(d.url);
      if (!nombre || !url) {
        console.warn('[menú] Destacado ignorado: necesita "nombre" y una "url" válida.', d);
        return;
      }

      const id = `destacado-${i}`;
      const a = crear("a", "destacado__enlace");
      a.href = url;
      a.setAttribute("aria-labelledby", `${id}-nombre`);
      if (typeof d.color === "string" && d.color.trim()) {
        a.style.setProperty("--acento", d.color.trim());
      }
      if (d.nuevaPestana === true) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }

      const icono = String(d.icono || "").trim();
      if (icono) a.append(crearFicha({ nombre, icono }));

      const texto = crear("span", "destacado__texto");
      const dominio = new URL(url).hostname.replace(/^www\./, "");
      texto.append(crear("span", "destacado__dominio", dominio));

      const titulo = crear("span", "destacado__nombre", nombre);
      titulo.id = `${id}-nombre`;
      if (d.nuevaPestana === true) {
        titulo.append(crear("span", "sr", " (se abre en otra pestaña)"));
      }
      texto.append(titulo);

      if (d.descripcion) {
        const desc = crear("span", "destacado__desc", String(d.descripcion));
        desc.id = `${id}-desc`;
        a.setAttribute("aria-describedby", desc.id);
        texto.append(desc);
      }

      const boton = crear("span", "destacado__boton", String(d.boton || "Visitar la web"));
      boton.setAttribute("aria-hidden", "true");
      if (d.nuevaPestana === true) boton.append(iconoExterno());

      a.append(texto, boton);
      contenedor.append(a);
    });

    contenedor.hidden = contenedor.children.length === 0;
  }

  /* ── Filtros ───────────────────────────────────────────────────────── */

  function pintarFiltros() {
    // Categorías en el orden de apps.js; las desconocidas, al final.
    const presentes = new Set(apps.map((a) => a.tipo));
    const orden = [
      ...Object.keys(categorias).filter((k) => presentes.has(k)),
      ...[...presentes].filter((k) => !(k in categorias)),
    ];

    if (orden.length < 2) {
      filtrosEl.hidden = true;
      return;
    }

    const opciones = [
      { clave: "todo", nombre: "Todo", n: apps.length, color: null },
      ...orden.map((clave) => {
        const ejemplo = apps.find((a) => a.tipo === clave);
        return {
          clave,
          nombre: ejemplo.cat.nombre,
          n: apps.filter((a) => a.tipo === clave).length,
          color: ejemplo.cat.color,
        };
      }),
    ];

    for (const op of opciones) {
      const b = crear("button", "filtro");
      b.type = "button";
      b.dataset.clave = op.clave;
      b.setAttribute("aria-pressed", String(op.clave === filtro));
      if (op.color) b.style.setProperty("--cat", op.color);
      b.append(op.nombre, crear("span", "filtro__n", String(op.n)));
      b.addEventListener("click", () => elegirFiltro(op.clave));
      filtrosEl.append(b);
    }
  }

  function elegirFiltro(clave) {
    filtro = clave;
    for (const b of filtrosEl.children) {
      b.setAttribute("aria-pressed", String(b.dataset.clave === clave));
    }
    pintar();
  }

  /* ── Lista ─────────────────────────────────────────────────────────── */

  function pintar({ anunciar = true } = {}) {
    const terminos = plano(buscar.value.trim()).split(/\s+/).filter(Boolean);

    visibles = apps.filter(
      (a) =>
        (filtro === "todo" || a.tipo === filtro) &&
        terminos.every((t) => a.texto.includes(t))
    );

    for (const nodo of nodos.values()) nodo.classList.remove("destacado");
    lista.replaceChildren(...visibles.map((a) => nodos.get(a.id)));

    // Con texto en el buscador, Intro abre el primer resultado: se marca.
    if (terminos.length && visibles.length) {
      nodos.get(visibles[0].id).classList.add("destacado");
    }

    if (visibles.length === 0) {
      const consulta = buscar.value.trim();
      mostrarVacio(
        consulta ? `Nada coincide con «${consulta}».` : "No hay nada en esta categoría.",
        "Prueba con otro nombre o muestra todo de nuevo.",
        { texto: "Mostrar todo", accion: reiniciar }
      );
    } else {
      vacio.hidden = true;
    }

    if (anunciar) {
      estado.textContent =
        visibles.length === 1 ? "1 resultado" : `${visibles.length} resultados`;
    }
  }

  function crearItem(app, indice) {
    const li = crear("li", "item");
    li.style.setProperty("--cat", app.cat.color || COLOR_NEUTRO);
    li.style.setProperty("--giro", app.giro);
    li.style.setProperty("--i", String(indice));

    const a = crear("a", "item__enlace");
    a.href = app.url;
    a.setAttribute("aria-labelledby", `${app.id}-nombre`);
    if (app.descripcion) a.setAttribute("aria-describedby", `${app.id}-desc`);
    if (app.nuevaPestana) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    const nombre = crear("span", "item__nombre", app.nombre);
    nombre.id = `${app.id}-nombre`;
    if (app.nuevaPestana) {
      nombre.append(iconoExterno(), crear("span", "sr", " (se abre en otra pestaña)"));
    }

    a.append(crearFicha(app), nombre);

    if (app.descripcion) {
      const desc = crear("span", "item__desc", app.descripcion);
      desc.id = `${app.id}-desc`;
      a.append(desc);
    }

    a.append(crear("span", "item__tipo", app.cat.singular));
    li.append(a);
    return li;
  }

  function crearFicha(app) {
    const ficha = crear("span", "ficha");
    ficha.setAttribute("aria-hidden", "true");

    const texto = () => {
      const valor = app.icono && !esImagen(app.icono) ? app.icono : inicial(app.nombre);
      const esEmoji = /\p{Extended_Pictographic}/u.test(valor);
      return crear("span", esEmoji ? "ficha__emoji" : "ficha__letras", valor);
    };

    if (esImagen(app.icono)) {
      const img = new Image();
      img.alt = "";
      img.decoding = "async";
      img.src = app.icono;
      img.addEventListener("error", () => {
        console.warn(`[menú] No se ha podido cargar el icono de "${app.nombre}": ${app.icono}`);
        img.replaceWith(texto());
      });
      ficha.append(img);
    } else {
      ficha.append(texto());
    }
    return ficha;
  }

  function esImagen(valor) {
    return (
      /\.(png|jpe?g|gif|webp|avif|svg|ico)(\?.*)?$/i.test(valor) ||
      /^(https?:\/\/|data:image\/)/i.test(valor)
    );
  }

  function inicial(nombre) {
    return [...nombre][0].toUpperCase();
  }

  function iconoExterno() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("class", "item__externo");
    svg.setAttribute("aria-hidden", "true");
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", "M6 3H3.5A.5.5 0 0 0 3 3.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V10M9 3h4v4M13 3 7.5 8.5");
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "1.6");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    svg.append(p);
    return svg;
  }

  function mostrarVacio(titulo, detalle, boton) {
    vacio.replaceChildren(crear("p", "vacio__titulo", titulo), crear("p", "vacio__detalle", detalle));
    if (boton) {
      const b = crear("button", "vacio__boton", boton.texto);
      b.type = "button";
      b.addEventListener("click", boton.accion);
      vacio.append(b);
    }
    vacio.hidden = false;
  }

  function reiniciar() {
    buscar.value = "";
    elegirFiltro("todo");
    buscar.focus();
  }

  // Única animación automática: las fichas "caen" al cargar la página.
  function animarLlegada() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    raiz.classList.add("llegada");
    setTimeout(() => raiz.classList.remove("llegada"), 600 + apps.length * 45);
  }

  /* ── Teclado ───────────────────────────────────────────────────────── */

  function conectarTeclado() {
    buscar.addEventListener("input", () => pintar());

    buscar.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && visibles.length) {
        e.preventDefault();
        nodos.get(visibles[0].id).querySelector("a").click();
      } else if (e.key === "Escape") {
        if (buscar.value) {
          e.preventDefault();
          buscar.value = "";
          pintar();
        } else {
          buscar.blur();
        }
      }
    });

    // "/" lleva al buscador desde cualquier parte de la página.
    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t.isContentEditable) return;
      e.preventDefault();
      buscar.focus();
      buscar.select();
    });
  }

  /* ── Tema ──────────────────────────────────────────────────────────── */

  function iniciarTema() {
    const oscuroSistema = matchMedia("(prefers-color-scheme: dark)");
    const actual = () => raiz.dataset.theme || (oscuroSistema.matches ? "dark" : "light");
    const etiquetar = () =>
      botonTema.setAttribute(
        "aria-label",
        actual() === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
      );

    botonTema.addEventListener("click", () => {
      const nuevo = actual() === "dark" ? "light" : "dark";
      raiz.dataset.theme = nuevo;
      try {
        localStorage.setItem("menu-tema", nuevo);
      } catch {
        /* Sin almacenamiento: el cambio dura hasta recargar. */
      }
      etiquetar();
    });
    oscuroSistema.addEventListener("change", etiquetar);
    etiquetar();
  }

  /* ── Utilidades ────────────────────────────────────────────────────── */

  function crear(etiqueta, clase, texto) {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto != null) el.textContent = texto;
    return el;
  }
})();
