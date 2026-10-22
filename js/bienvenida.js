
(() => {
  const bienvenida = document.getElementById("bienvenida");
  const botonSaltar = document.getElementById("saltarBienvenida");

  if (!bienvenida) return;

  const CLAVE = "tacos_orientales_bienvenida_v1";
  const DURACION = 10000;
  const INTERVALO = 7 * 24 * 60 * 60 * 1000;

  let temporizador = null;
  let finalizada = false;

  const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const obtenerUltimaVisita = () => {
    try {
      return Number(localStorage.getItem(CLAVE)) || 0;
    } catch {
      return 0;
    }
  };

  const guardarVisita = () => {
    try {
      localStorage.setItem(CLAVE, String(Date.now()));
    } catch {
      return;
    }
  };

  const cerrarBienvenida = () => {
    if (finalizada) return;

    finalizada = true;

    if (temporizador !== null) {
      clearTimeout(temporizador);
      temporizador = null;
    }

    guardarVisita();

    bienvenida.classList.add("saliendo");
    bienvenida.setAttribute("aria-hidden", "true");

    document.body.classList.remove("bienvenida-activa");

    window.setTimeout(() => {
      bienvenida.classList.remove("visible", "saliendo");
      bienvenida.hidden = true;
    }, 850);
  };

  const iniciarBienvenida = () => {
    const ultimaVisita = obtenerUltimaVisita();
    const tiempoTranscurrido = Date.now() - ultimaVisita;

    if (
      reducirMovimiento ||
      (ultimaVisita > 0 &&
        tiempoTranscurrido >= 0 &&
        tiempoTranscurrido < INTERVALO)
    ) {
      bienvenida.hidden = true;
      bienvenida.setAttribute("aria-hidden", "true");
      return;
    }

    bienvenida.hidden = false;
    bienvenida.classList.add("visible");
    bienvenida.setAttribute("aria-hidden", "false");

    document.body.classList.add("bienvenida-activa");

    temporizador = window.setTimeout(
      cerrarBienvenida,
      DURACION
    );
  };

  botonSaltar?.addEventListener("click", cerrarBienvenida);

  iniciarBienvenida();
})();
