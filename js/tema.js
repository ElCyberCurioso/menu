// Aplica el tema guardado antes de pintar la página, para evitar un parpadeo.
try {
  var temaGuardado = localStorage.getItem("menu-tema");
  if (temaGuardado === "dark" || temaGuardado === "light") {
    document.documentElement.dataset.theme = temaGuardado;
  }
} catch (e) {
  /* Sin almacenamiento disponible: se usa el tema del sistema. */
}
