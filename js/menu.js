
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const menuToggle = document.getElementById("menuToggle");
  const navEnlaces = document.getElementById("navEnlaces");
  const anioActual = document.getElementById("anioActual");
  const buscarPlatillo = document.getElementById("buscarPlatillo");
  const limpiarBusqueda = document.getElementById("limpiarBusqueda");
  const verTodoMenu = document.getElementById("verTodoMenu");
  const contadorResultados = document.getElementById("contadorResultados");
  const sinResultados = document.getElementById("sinResultados");
  const categoriasNav = document.getElementById("categoriasNav");
  const categoriasContenedor = document.querySelector(".categorias-contenedor");

  const secciones = Array.from(document.querySelectorAll(".categoria-seccion"));
  const categorias = Array.from(document.querySelectorAll(".categoria-link"));
  const productos = Array.from(document.querySelectorAll(".producto-item"));
  const filasKilos = Array.from(document.querySelectorAll(".kilos-fila"));
  const bebidas = Array.from(document.querySelectorAll(".bebida-fila"));
  const elementos = [...productos, ...filasKilos, ...bebidas];

  const imagenes = {
    "Tacos al pastor": "tacos-al-pastor.jpg",
    "Tacos al pastor con queso": "tacos-al-pastor-con-queso.jpg",
    "Tacos al pastor con tortillinas": "pastor-con-tortillinas.jpg",
    "Tacos al pastor con tortillinas y queso": "pastor-con-tortillinas-y-queso.jpg",
    "Alambre": "alambre.jpg",
    "Vegetariano": "vegetariano.jpg",
    "Albañil": "albanil.jpg",
    "Gallito": "gallito.jpg",
    "Especial": "especial.jpg",
    "Chuleta Suiza": "chuleta-suiza.jpg",
    "Tamborazo": "tamborazo.jpg",
    "Submarino": "submarino.jpg",
    "Pingüino": "pinguino.jpg",
    "Qué me vez": "que-me-vez.jpg",
    "Qué me notas": "que-me-notas.jpg",
    "Gringas": "gringas.jpg",
    "Sincronizadas": "sincronizadas.jpg",
    "Quesadillas": "quesadillas.jpg",
    "Queso natural": "queso-natural.jpg",
    "Queso con chorizo": "queso-con-chorizo.jpg",
    "Queso con champiñones": "queso-con-champinones.jpg",
    "Carne al pastor 1 kilo": "pastor-1-kilo.jpg",
    "Carne al pastor tres cuartos de kilo": "pastor-tres-cuartos.jpg",
    "Carne al pastor medio kilo": "pastor-medio-kilo.jpg",
    "Carne al pastor cuarto de kilo": "pastor-cuarto-kilo.jpg",
    "Agua de sabor": "agua-de-sabor.jpg",
    "Agua de sabor 1 litro": "agua-de-sabor-1-litro.jpg",
    "Agua natural 600 ml": "agua-natural-600ml.jpg",
    "Refresco": "refresco.jpg",
    "Refresco 600 ml": "refresco-600ml.jpg",
    "Refresco 3 litros": "refresco-3-litros.jpg"
  };

  let buscando = false;
  let desplazamientoProgramado = false;
  let navegacionManual = false;
  let temporizadorNavegacion = null;

  const normalizar = valor =>
    String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  if (anioActual) {
    anioActual.textContent = new Date().getFullYear();
  }

  const cerrarMenu = () => {
    navEnlaces?.classList.remove("abierto");
    menuToggle?.classList.remove("activo");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-abierto");
  };

  menuToggle?.addEventListener("click", () => {
    const abrir = !navEnlaces?.classList.contains("abierto");

    navEnlaces?.classList.toggle("abierto", abrir);
    menuToggle.classList.toggle("activo", abrir);
    menuToggle.setAttribute("aria-expanded", String(abrir));
    menuToggle.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-abierto", abrir);
  });

  navEnlaces?.querySelectorAll("a").forEach(enlace => {
    enlace.addEventListener("click", cerrarMenu);
  });

  document.addEventListener("click", evento => {
    if (
      navEnlaces?.classList.contains("abierto") &&
      !navEnlaces.contains(evento.target) &&
      !menuToggle?.contains(evento.target)
    ) {
      cerrarMenu();
    }
  });

  document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
      cerrarMenu();
      buscarPlatillo?.blur();
    }
  });

  const cargarImagen = (ruta, callback) => {
    const imagen = new Image();

    imagen.onload = () => {
      if (imagen.naturalWidth > 0) {
        callback(ruta);
      }
    };

    imagen.onerror = () => {};

    imagen.src = ruta;
  };

  const prepararImagenesProductos = () => {
    elementos.forEach(elemento => {
      const nombre = elemento.dataset.nombre;
      const archivo = imagenes[nombre];

      if (!archivo) return;

      const ruta = `imagenes/menu/${archivo}`;

      cargarImagen(ruta, rutaValida => {
        if (!elemento.isConnected) return;

        const contenedor = document.createElement("div");
        const imagen = document.createElement("img");

        contenedor.className = "producto-fotografia";

        imagen.src = rutaValida;
        imagen.alt = nombre;
        imagen.loading = "lazy";
        imagen.decoding = "async";

        contenedor.appendChild(imagen);

        if (elemento.classList.contains("producto-item")) {
          elemento.insertBefore(contenedor, elemento.firstChild);
          elemento.classList.add("con-fotografia");
        } else if (elemento.classList.contains("bebida-fila")) {
          elemento.insertBefore(contenedor, elemento.firstChild);
          elemento.classList.add("con-fotografia");
        } else if (elemento.classList.contains("kilos-fila")) {
          elemento.appendChild(contenedor);
          elemento.classList.add("con-fotografia");
        }
      });
    });

    document.querySelectorAll(
      ".carta-hero-foto, .tacos-destacado-imagen, .categoria-banner, .kilos-foto"
    ).forEach(contenedor => {
      const imagen = contenedor.querySelector("img");

      if (!imagen) return;

      const ocultarSiFalla = () => {
        if (!imagen.naturalWidth) {
          contenedor.hidden = true;

          if (contenedor.classList.contains("carta-hero-foto")) {
            document.querySelector(".carta-hero-grid")?.classList.add("sin-foto");
          }

          if (contenedor.classList.contains("tacos-destacado-imagen")) {
            contenedor.closest(".tacos-destacado")?.classList.add("sin-foto");
          }

          if (contenedor.classList.contains("kilos-foto")) {
            contenedor.closest(".kilos-presentacion")?.classList.add("sin-foto");
          }
        }
      };

      imagen.addEventListener("error", ocultarSiFalla);

      if (imagen.complete) {
        ocultarSiFalla();
      }
    });
  };

  const obtenerOffset = () => {
    const altoHeader = header?.getBoundingClientRect().height || 75;
    const altoCategorias = categoriasContenedor?.getBoundingClientRect().height || 65;

    return altoHeader + altoCategorias + 18;
  };

  const irA = (elemento, incluirCategorias = false) => {
    if (!elemento) return;

    const altoHeader = header?.getBoundingClientRect().height || 75;
    const offset = incluirCategorias ? obtenerOffset() : altoHeader + 18;

    const destino = elemento.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(0, destino),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  };

  const marcarCategoria = (id, desplazarBarra = false) => {
    categorias.forEach(categoria => {
      const activa = categoria.dataset.categoria === id;

      categoria.classList.toggle("activo", activa);

      if (activa) {
        categoria.setAttribute("aria-current", "location");

        if (desplazarBarra && categoriasNav) {
          const izquierda =
            categoria.offsetLeft -
            categoriasNav.offsetLeft -
            categoriasNav.clientWidth / 2 +
            categoria.clientWidth / 2;

          categoriasNav.scrollTo({
            left: Math.max(0, izquierda),
            behavior: "smooth"
          });
        }
      } else {
        categoria.removeAttribute("aria-current");
      }
    });
  };

  const actualizarCategoriaPorScroll = () => {
    if (buscando || navegacionManual) return;

    const posicion = window.scrollY + obtenerOffset() + 35;
    let idActual = secciones.find(seccion => !seccion.hidden)?.id;

    secciones.forEach(seccion => {
      if (!seccion.hidden && seccion.offsetTop <= posicion) {
        idActual = seccion.id;
      }
    });

    if (idActual) {
      marcarCategoria(idActual, false);
    }
  };

  const actualizarHeader = () => {
    header?.classList.toggle("header-scroll", window.scrollY > 35);
  };

  window.addEventListener("scroll", () => {
    actualizarHeader();

    if (desplazamientoProgramado) return;

    desplazamientoProgramado = true;

    requestAnimationFrame(() => {
      actualizarCategoriaPorScroll();
      desplazamientoProgramado = false;
    });
  }, { passive: true });

  const iniciarNavegacionManual = () => {
    navegacionManual = true;

    clearTimeout(temporizadorNavegacion);

    temporizadorNavegacion = setTimeout(() => {
      navegacionManual = false;
      actualizarCategoriaPorScroll();
    }, 1100);
  };

  const limpiarFiltros = () => {
    if (buscarPlatillo) {
      buscarPlatillo.value = "";
    }

    buscando = false;

    elementos.forEach(elemento => {
      elemento.hidden = false;
    });

    secciones.forEach(seccion => {
      seccion.hidden = false;
    });

    categorias.forEach(categoria => {
      categoria.classList.remove("sin-coincidencias");
    });

    document.querySelectorAll(
      ".tacos-destacado, .nota-menu, .categoria-banner, .kilos-incluye, .bebidas-icono"
    ).forEach(elemento => {
      elemento.hidden = false;
    });

    if (limpiarBusqueda) {
      limpiarBusqueda.hidden = true;
    }

    if (sinResultados) {
      sinResultados.hidden = true;
    }

    categoriasNav?.classList.remove("busqueda-activa");

    if (contadorResultados) {
      contadorResultados.textContent = `${elementos.length} opciones para disfrutar`;
    }

    actualizarCategoriaPorScroll();
  };

  categorias.forEach(categoria => {
    categoria.addEventListener("click", evento => {
      evento.preventDefault();

      const id = categoria.dataset.categoria;
      const destino = document.getElementById(id);

      if (!destino) return;

      if (buscando) {
        limpiarFiltros();
      }

      iniciarNavegacionManual();
      marcarCategoria(id, true);
      irA(destino, true);

      history.replaceState(null, "", `#${id}`);
    });
  });

  const filtrarMenu = () => {
    const consulta = normalizar(buscarPlatillo?.value || "");
    const terminos = consulta.split(" ").filter(Boolean);

    if (!terminos.length) {
      limpiarFiltros();
      return;
    }

    buscando = true;
    let total = 0;

    elementos.forEach(elemento => {
      const texto = normalizar(
        `${elemento.dataset.nombre || ""} ${elemento.dataset.busqueda || ""} ${elemento.textContent || ""}`
      );

      const coincide = terminos.every(termino => texto.includes(termino));

      elemento.hidden = !coincide;

      if (coincide) {
        total++;
      }
    });

    secciones.forEach(seccion => {
      const visibles = seccion.querySelectorAll(
        ".producto-item:not([hidden]), .kilos-fila:not([hidden]), .bebida-fila:not([hidden])"
      ).length;

      seccion.hidden = visibles === 0;

      const categoria = categorias.find(
        item => item.dataset.categoria === seccion.id
      );

      categoria?.classList.toggle("sin-coincidencias", visibles === 0);
    });

    const tacosVisibles = document.querySelectorAll(
      "#tacos .producto-item:not([hidden])"
    ).length;

    const platillosVisibles = document.querySelectorAll(
      "#platillos .producto-item:not([hidden])"
    ).length;

    const kilosVisibles = document.querySelectorAll(
      "#kilos .kilos-fila:not([hidden])"
    ).length;

    const bebidasVisibles = document.querySelectorAll(
      "#bebidas .bebida-fila:not([hidden])"
    ).length;

    const destacadoTacos = document.querySelector(".tacos-destacado");
    const notaTacos = document.querySelector(".nota-menu");
    const bannerPlatillos = document.querySelector(".categoria-banner");
    const incluyeKilos = document.querySelector(".kilos-incluye");
    const iconoBebidas = document.querySelector(".bebidas-icono");

    if (destacadoTacos) destacadoTacos.hidden = true;
    if (notaTacos) notaTacos.hidden = tacosVisibles === 0;
    if (bannerPlatillos) bannerPlatillos.hidden = true;
    if (incluyeKilos) incluyeKilos.hidden = kilosVisibles === 0;
    if (iconoBebidas) iconoBebidas.hidden = true;

    if (contadorResultados) {
      contadorResultados.textContent =
        total === 1 ? "1 opción encontrada" : `${total} opciones encontradas`;
    }

    if (sinResultados) {
      sinResultados.hidden = total !== 0;
    }

    if (limpiarBusqueda) {
      limpiarBusqueda.hidden = false;
    }

    categoriasNav?.classList.add("busqueda-activa");

    categorias.forEach(categoria => {
      categoria.classList.remove("activo");
      categoria.removeAttribute("aria-current");
    });
  };

  buscarPlatillo?.addEventListener("input", filtrarMenu);
  buscarPlatillo?.addEventListener("search", filtrarMenu);

  limpiarBusqueda?.addEventListener("click", () => {
    limpiarFiltros();
    buscarPlatillo?.focus();
  });

  verTodoMenu?.addEventListener("click", () => {
    limpiarFiltros();
    irA(document.getElementById("carta"));
  });

  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    if (enlace.classList.contains("categoria-link")) return;

    enlace.addEventListener("click", evento => {
      const href = enlace.getAttribute("href");

      if (!href || href === "#") return;

      const destino = document.getElementById(href.slice(1));

      if (!destino) return;

      evento.preventDefault();
      cerrarMenu();

      if (buscando && destino.classList.contains("categoria-seccion")) {
        limpiarFiltros();
      }

      irA(destino, destino.classList.contains("categoria-seccion"));
      history.replaceState(null, "", href);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      cerrarMenu();
    }
  });

  prepararImagenesProductos();
  limpiarFiltros();
  actualizarHeader();

  if (window.location.hash) {
    const id = decodeURIComponent(window.location.hash.substring(1));
    const destino = document.getElementById(id);

    if (destino) {
      window.setTimeout(() => {
        if (destino.classList.contains("categoria-seccion")) {
          iniciarNavegacionManual();
          marcarCategoria(id, true);
        }

        irA(destino, destino.classList.contains("categoria-seccion"));
      }, 200);
    }
  }
});
