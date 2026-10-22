
document.addEventListener("DOMContentLoaded", () => {
  const libro = document.getElementById("libro");
  const escenario = document.getElementById("libroEscenario");
  const hojas = Array.from(document.querySelectorAll(".hoja"));
  const botonAnterior = document.getElementById("paginaAnterior");
  const botonSiguiente = document.getElementById("paginaSiguiente");
  const nombrePagina = document.getElementById("nombrePagina");
  const numeroPagina = document.getElementById("numeroPagina");
  const puntos = Array.from(document.querySelectorAll(".libro-punto"));
  const anioActual = document.getElementById("anioActual");

  if (anioActual) {
    anioActual.textContent = new Date().getFullYear();
  }

  if (!libro || !escenario || !hojas.length) {
    return;
  }

  const nombres = [
    "Portada",
    "Tacos al pastor",
    "Platillos",
    "Tortillinas y quesos",
    "Carne por kilo",
    "Bebidas",
    "Pedidos y contacto"
  ];

  const duracion = 850;
  const distanciaMinima = 45;
  const ultimaPagina = hojas.length - 1;

  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let paginaActual = 0;
  let animando = false;
  let inicioX = 0;
  let inicioY = 0;
  let gestoActivo = false;
  let temporizador = null;
  let observador = null;

  const obtenerAltura = hoja => {
    if (!hoja) return 0;

    const interior = hoja.querySelector(".hoja-interior");

    if (!interior) return 0;

    return Math.ceil(interior.getBoundingClientRect().height);
  };

  const medirAltura = indice => {
    const hoja = hojas[indice];

    if (!hoja) return 0;

    const interior = hoja.querySelector(".hoja-interior");

    if (!interior) return 0;

    return Math.ceil(interior.scrollHeight);
  };

  const actualizarAltura = indice => {
    const altura = medirAltura(indice);

    if (altura > 0) {
      libro.style.height = `${altura}px`;
    }
  };

  const limpiarEstilos = hoja => {
    hoja.classList.remove(
      "activa",
      "saliendo",
      "entrando",
      "girando-adelante",
      "girando-atras"
    );

    hoja.style.removeProperty("transform");
    hoja.style.removeProperty("transform-origin");
    hoja.style.removeProperty("transition");
    hoja.style.removeProperty("z-index");
    hoja.style.removeProperty("visibility");
    hoja.style.removeProperty("opacity");
  };

  const actualizarControles = () => {
    if (botonAnterior) {
      botonAnterior.disabled = animando || paginaActual === 0;
    }

    if (botonSiguiente) {
      botonSiguiente.disabled = animando || paginaActual === ultimaPagina;
    }

    if (nombrePagina) {
      nombrePagina.textContent =
        nombres[paginaActual] || `Página ${paginaActual + 1}`;
    }

    if (numeroPagina) {
      numeroPagina.textContent = `${paginaActual + 1} de ${hojas.length}`;
    }

    puntos.forEach((punto, indice) => {
      const activo = indice === paginaActual;

      punto.classList.toggle("activo", activo);
      punto.disabled = animando;

      if (activo) {
        punto.setAttribute("aria-current", "page");
      } else {
        punto.removeAttribute("aria-current");
      }
    });
  };

  const actualizarAccesibilidad = () => {
    hojas.forEach((hoja, indice) => {
      const visible = indice === paginaActual;

      hoja.setAttribute("aria-hidden", String(!visible));
      hoja.inert = !visible;
    });
  };

  const mostrarPagina = indice => {
    if (temporizador !== null) {
      clearTimeout(temporizador);
      temporizador = null;
    }

    hojas.forEach((hoja, posicion) => {
      limpiarEstilos(hoja);

      if (posicion === indice) {
        hoja.classList.add("activa");
      }
    });

    paginaActual = indice;
    animando = false;

    actualizarAltura(indice);
    actualizarControles();
    actualizarAccesibilidad();
  };

  const terminarAnimacion = indice => {
    mostrarPagina(indice);
  };

  const cambiarPagina = destino => {
    const indice = Number(destino);

    if (
      animando ||
      !Number.isInteger(indice) ||
      indice < 0 ||
      indice > ultimaPagina ||
      indice === paginaActual
    ) {
      return;
    }

    if (movimientoReducido.matches) {
      mostrarPagina(indice);
      return;
    }

    const origen = paginaActual;
    const haciaAdelante = indice > origen;
    const hojaActual = hojas[origen];
    const hojaDestino = hojas[indice];

    animando = true;
    actualizarControles();

    const alturaActual = medirAltura(origen);
    const alturaDestino = medirAltura(indice);
    const alturaMayor = Math.max(alturaActual, alturaDestino);

    if (alturaMayor > 0) {
      libro.style.height = `${alturaMayor}px`;
    }

    hojaDestino.classList.add("entrando");
    hojaActual.classList.add("saliendo");

    hojaDestino.style.zIndex = "15";
    hojaActual.style.zIndex = "20";

    hojaDestino.style.visibility = "visible";
    hojaDestino.style.opacity = "1";

    hojaActual.style.visibility = "visible";
    hojaActual.style.opacity = "1";

    hojaActual.style.transformOrigin = haciaAdelante
      ? "left center"
      : "right center";

    hojaActual.style.transform = "rotateY(0deg)";

    hojaActual.setAttribute("aria-hidden", "true");
    hojaActual.inert = true;

    hojaDestino.setAttribute("aria-hidden", "true");
    hojaDestino.inert = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hojaActual.style.transform = haciaAdelante
          ? "rotateY(-165deg)"
          : "rotateY(165deg)";
      });
    });

    temporizador = setTimeout(() => {
      terminarAnimacion(indice);
    }, duracion);
  };

  const siguientePagina = () => {
    cambiarPagina(paginaActual + 1);
  };

  const anteriorPagina = () => {
    cambiarPagina(paginaActual - 1);
  };

  botonSiguiente?.addEventListener("click", siguientePagina);
  botonAnterior?.addEventListener("click", anteriorPagina);

  puntos.forEach(punto => {
    punto.addEventListener("click", () => {
      cambiarPagina(Number(punto.dataset.irPagina));
    });
  });

  escenario.addEventListener(
    "touchstart",
    evento => {
      if (animando || evento.touches.length !== 1) {
        gestoActivo = false;
        return;
      }

      inicioX = evento.touches[0].clientX;
      inicioY = evento.touches[0].clientY;
      gestoActivo = true;
    },
    { passive: true }
  );

  escenario.addEventListener(
    "touchend",
    evento => {
      if (!gestoActivo || animando || !evento.changedTouches.length) {
        gestoActivo = false;
        return;
      }

      const finX = evento.changedTouches[0].clientX;
      const finY = evento.changedTouches[0].clientY;

      const diferenciaX = finX - inicioX;
      const diferenciaY = finY - inicioY;

      gestoActivo = false;

      if (
        Math.abs(diferenciaX) < distanciaMinima ||
        Math.abs(diferenciaX) <= Math.abs(diferenciaY) * 1.3
      ) {
        return;
      }

      if (diferenciaX < 0) {
        siguientePagina();
      } else {
        anteriorPagina();
      }
    },
    { passive: true }
  );

  escenario.addEventListener(
    "touchcancel",
    () => {
      gestoActivo = false;
    },
    { passive: true }
  );

  document.addEventListener("keydown", evento => {
    const elemento = document.activeElement;
    const etiqueta = elemento?.tagName?.toLowerCase();

    if (
      etiqueta === "input" ||
      etiqueta === "textarea" ||
      etiqueta === "select" ||
      elemento?.isContentEditable
    ) {
      return;
    }

    if (evento.key === "ArrowRight") {
      if (paginaActual < ultimaPagina) {
        evento.preventDefault();
        siguientePagina();
      }
    }

    if (evento.key === "ArrowLeft") {
      if (paginaActual > 0) {
        evento.preventDefault();
        anteriorPagina();
      }
    }

    if (evento.key === "Home" && escenario.contains(elemento)) {
      evento.preventDefault();
      cambiarPagina(0);
    }

    if (evento.key === "End" && escenario.contains(elemento)) {
      evento.preventDefault();
      cambiarPagina(ultimaPagina);
    }
  });

  const actualizarPorResize = () => {
    if (!animando) {
      actualizarAltura(paginaActual);
    }
  };

  window.addEventListener("resize", actualizarPorResize);

  window.addEventListener("orientationchange", () => {
    setTimeout(actualizarPorResize, 250);
  });

  if ("ResizeObserver" in window) {
    observador = new ResizeObserver(() => {
      if (!animando) {
        actualizarAltura(paginaActual);
      }
    });

    hojas.forEach(hoja => {
      const interior = hoja.querySelector(".hoja-interior");

      if (interior) {
        observador.observe(interior);
      }
    });
  }

  document.fonts?.ready.then(() => {
    actualizarAltura(paginaActual);
  });

  document.querySelectorAll(".hoja img").forEach(imagen => {
    imagen.addEventListener("load", actualizarPorResize);
    imagen.addEventListener("error", actualizarPorResize);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && animando) {
      mostrarPagina(paginaActual);
    }
  });

  window.addEventListener("pagehide", () => {
    if (temporizador !== null) {
      clearTimeout(temporizador);
    }

    observador?.disconnect();
  });

  mostrarPagina(0);
});
