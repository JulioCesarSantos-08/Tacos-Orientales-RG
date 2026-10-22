
document.addEventListener("DOMContentLoaded", () => {
  const seccion = document.getElementById("videos");
  const contenedor = document.getElementById("videosGrid");

  if (!seccion || !contenedor) return;

  const videosDisponibles = [
    {
      archivo: "corte-pastor.mp4",
      etiqueta: "DIRECTO DEL TROMPO",
      titulo: "Del trompo a tu mesa",
      descripcion: "Mira cómo cortamos nuestra deliciosa carne al pastor, preparada para disfrutar en cada taco.",
      pie: "El auténtico sabor del pastor"
    },
    {
      archivo: "preparacion-tortillas.mp4",
      etiqueta: "DESDE NUESTRA COCINA",
      titulo: "El toque de nuestras tortillas",
      descripcion: "Conoce parte de la preparación que acompaña nuestros tacos y especialidades.",
      pie: "Preparado con dedicación"
    },
    {
      archivo: "preparacion-platillo.mp4",
      etiqueta: "HECHO PARA ANTOJARSE",
      titulo: "Platillos llenos de sabor",
      descripcion: "Descubre cómo preparamos algunos de los platillos que nos distinguen.",
      pie: "Sabor en cada preparación"
    },
    {
      archivo: "nuestro-local.mp4",
      etiqueta: "CONÓCENOS",
      titulo: "Bienvenido a Tacos Orientales",
      descripcion: "Conoce nuestro espacio y el ambiente que te espera en Río Grande, Oaxaca.",
      pie: "Te esperamos con mucho sabor"
    }
  ];

  const rutaVideos = "imagenes/videos/";
  const controles = new Map();
  const elementosVideo = new Set();
  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let observador = null;
  let paginaVisible = !document.hidden;

  const crearElemento = (etiqueta, clase, texto) => {
    const elemento = document.createElement(etiqueta);

    if (clase) elemento.className = clase;
    if (texto) elemento.textContent = texto;

    return elemento;
  };

  const actualizarControles = video => {
    const control = controles.get(video);

    if (!control) return;

    const { reproducir, sonido } = control;

    const reproduciendo = !video.paused && !video.ended;

    reproducir.setAttribute(
      "aria-label",
      reproduciendo ? "Pausar video" : "Reproducir video"
    );

    reproducir.setAttribute(
      "aria-pressed",
      String(reproduciendo)
    );

    reproducir.querySelector(".video-control-icono").textContent =
      reproduciendo ? "Ⅱ" : "▶";

    sonido.setAttribute(
      "aria-label",
      video.muted ? "Activar sonido" : "Silenciar video"
    );

    sonido.setAttribute(
      "aria-pressed",
      String(!video.muted)
    );

    sonido.querySelector(".video-control-icono").textContent =
      video.muted ? "♪" : "♫";
  };

  const pausarOtros = actual => {
    elementosVideo.forEach(video => {
      if (video !== actual && !video.paused) {
        video.pause();
      }
    });
  };

  const reproducirVideo = async video => {
    if (!paginaVisible) return;

    pausarOtros(video);

    try {
      await video.play();
    } catch {
      actualizarControles(video);
    }
  };

  const crearTarjeta = datos => {
    const tarjeta = crearElemento("article", "video-tarjeta");
    const marco = crearElemento("div", "video-marco");
    const video = document.createElement("video");

    video.src = rutaVideos + datos.archivo;
    video.preload = "metadata";
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("disablepictureinpicture", "");
    video.setAttribute("controlslist", "nodownload noplaybackrate");
    video.setAttribute("aria-label", datos.titulo);

    const etiqueta = crearElemento(
      "span",
      "video-etiqueta",
      datos.etiqueta
    );

    const zonaControles = crearElemento(
      "div",
      "video-controles"
    );

    const botonReproducir = crearElemento(
      "button",
      "video-control video-control-reproducir"
    );

    botonReproducir.type = "button";
    botonReproducir.setAttribute(
      "aria-label",
      "Reproducir video"
    );

    const iconoReproducir = crearElemento(
      "span",
      "video-control-icono",
      "▶"
    );

    botonReproducir.appendChild(iconoReproducir);

    const botonSonido = crearElemento(
      "button",
      "video-control video-control-sonido"
    );

    botonSonido.type = "button";
    botonSonido.setAttribute(
      "aria-label",
      "Activar sonido"
    );

    const iconoSonido = crearElemento(
      "span",
      "video-control-icono",
      "♪"
    );

    botonSonido.appendChild(iconoSonido);

    zonaControles.append(
      botonReproducir,
      botonSonido
    );

    marco.append(
      video,
      etiqueta,
      zonaControles
    );

    const informacion = crearElemento(
      "div",
      "video-informacion"
    );

    const subtitulo = crearElemento(
      "span",
      "",
      "TACOS ORIENTALES"
    );

    const titulo = crearElemento(
      "h3",
      "",
      datos.titulo
    );

    const descripcion = crearElemento(
      "p",
      "",
      datos.descripcion
    );

    const pie = crearElemento(
      "div",
      "video-informacion-pie",
      datos.pie
    );

    informacion.append(
      subtitulo,
      titulo,
      descripcion,
      pie
    );

    tarjeta.append(
      marco,
      informacion
    );

    controles.set(video, {
      reproducir: botonReproducir,
      sonido: botonSonido
    });

    elementosVideo.add(video);

    botonReproducir.addEventListener("click", () => {
      if (video.paused) {
        reproducirVideo(video);
      } else {
        video.pause();
      }
    });

    botonSonido.addEventListener("click", () => {
      const activarSonido = video.muted;

      if (activarSonido) {
        elementosVideo.forEach(otro => {
          if (otro !== video) {
            otro.muted = true;
            actualizarControles(otro);
          }
        });
      }

      video.muted = !activarSonido;

      actualizarControles(video);

      if (video.paused) {
        reproducirVideo(video);
      }
    });

    video.addEventListener("play", () => {
      pausarOtros(video);
      actualizarControles(video);
    });

    video.addEventListener("pause", () => {
      actualizarControles(video);
    });

    video.addEventListener("volumechange", () => {
      actualizarControles(video);
    });

    video.addEventListener("error", () => {
      observador?.unobserve(video);
      elementosVideo.delete(video);
      controles.delete(video);
      tarjeta.remove();

      if (!contenedor.children.length) {
        seccion.hidden = true;
      }
    });

    actualizarControles(video);

    return { tarjeta, video };
  };

  const verificarArchivo = async archivo => {
    const url = rutaVideos + archivo;

    try {
      const respuesta = await fetch(url, {
        method: "HEAD",
        cache: "no-store"
      });

      if (!respuesta.ok) return false;

      const tipo = respuesta.headers.get("content-type") || "";

      if (tipo.includes("text/html")) return false;

      return true;
    } catch {
      return false;
    }
  };

  const cargarVideos = async () => {
    const resultados = await Promise.all(
      videosDisponibles.map(async datos => ({
        datos,
        existe: await verificarArchivo(datos.archivo)
      }))
    );

    const existentes = resultados.filter(
      resultado => resultado.existe
    );

    if (!existentes.length) {
      seccion.hidden = true;
      return;
    }

    if ("IntersectionObserver" in window) {
      observador = new IntersectionObserver(
        entradas => {
          entradas.forEach(entrada => {
            const video = entrada.target;

            if (!entrada.isIntersecting) {
              if (!video.paused) video.pause();
              return;
            }

            if (
              paginaVisible &&
              !movimientoReducido.matches &&
              video.muted &&
              video.paused
            ) {
              reproducirVideo(video);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.65
        }
      );
    }

    const fragmento = document.createDocumentFragment();

    existentes.forEach(({ datos }) => {
      const { tarjeta, video } = crearTarjeta(datos);

      fragmento.appendChild(tarjeta);

      if (observador) {
        observador.observe(video);
      }
    });

    contenedor.appendChild(fragmento);
    seccion.hidden = false;
  };

  document.addEventListener("visibilitychange", () => {
    paginaVisible = !document.hidden;

    if (!paginaVisible) {
      elementosVideo.forEach(video => {
        if (!video.paused) video.pause();
      });
    }
  });

  window.addEventListener("pagehide", () => {
    observador?.disconnect();

    elementosVideo.forEach(video => {
      video.pause();
    });
  });

  cargarVideos();
});
