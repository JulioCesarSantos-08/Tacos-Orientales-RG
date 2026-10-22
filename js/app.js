
import { db } from "./firebase.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { ref, onValue, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const auth = getAuth();

const menuToggle = document.getElementById("menuToggle");
const navEnlaces = document.getElementById("navEnlaces");
const header = document.querySelector(".header");
const anioActual = document.getElementById("anioActual");
const botonLike = document.getElementById("botonLike");
const totalLikes = document.getElementById("totalLikes");
const likeMensaje = document.getElementById("likeMensaje");

const RUTA_LIKES = "paginaPublica/likes";

let usuarioActual = null;
let likesCargados = false;
let procesandoLike = false;
let totalActual = 0;

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
  const abierto = navEnlaces?.classList.toggle("abierto") ?? false;

  menuToggle.classList.toggle("activo", abierto);
  menuToggle.setAttribute("aria-expanded", String(abierto));
  menuToggle.setAttribute(
    "aria-label",
    abierto ? "Cerrar menú" : "Abrir menú"
  );

  document.body.classList.toggle("menu-abierto", abierto);
});

navEnlaces?.querySelectorAll("a").forEach(enlace => {
  enlace.addEventListener("click", cerrarMenu);
});

document.addEventListener("keydown", evento => {
  if (evento.key === "Escape") {
    cerrarMenu();
  }
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

const actualizarHeader = () => {
  header?.classList.toggle("header-scroll", window.scrollY > 35);
};

window.addEventListener("scroll", actualizarHeader, { passive: true });
actualizarHeader();

const mostrarMensaje = mensaje => {
  if (likeMensaje) {
    likeMensaje.textContent = mensaje;
  }
};

const actualizarBotonLike = votado => {
  if (!botonLike) return;

  botonLike.classList.toggle("activo", votado);
  botonLike.setAttribute("aria-pressed", String(votado));

  botonLike.innerHTML = votado
    ? "<span>♥</span> ¡Gracias por tu apoyo!"
    : "<span>♥</span> Me gusta";

  botonLike.disabled = votado || procesandoLike || !likesCargados || !usuarioActual;
};

const iniciarLikes = () => {
  if (!botonLike || !totalLikes) return;

  botonLike.disabled = true;
  mostrarMensaje("Conectando con el contador...");

  onAuthStateChanged(auth, async usuario => {
    if (!usuario) {
      usuarioActual = null;

      try {
        await signInAnonymously(auth);
      } catch (error) {
        mostrarMensaje("No se pudo conectar. Intenta actualizar la página.");
        botonLike.disabled = true;
      }

      return;
    }

    usuarioActual = usuario;

    const likesRef = ref(db, RUTA_LIKES);

    onValue(
      likesRef,
      snapshot => {
        const likes = snapshot.val() || {};

        totalActual = Object.keys(likes).length;
        likesCargados = true;

        totalLikes.textContent = new Intl.NumberFormat("es-MX").format(totalActual);

        const votado = likes[usuario.uid] === true;

        actualizarBotonLike(votado);

        if (votado) {
          mostrarMensaje("¡Gracias por apoyar a Tacos Orientales!");
        } else {
          mostrarMensaje("¡Tu apoyo nos motiva a seguir mejorando!");
        }
      },
      error => {
        likesCargados = false;
        botonLike.disabled = true;
        totalLikes.textContent = "—";
        mostrarMensaje("No fue posible cargar los likes en este momento.");
      }
    );
  });
};

botonLike?.addEventListener("click", async () => {
  if (!usuarioActual || !likesCargados || procesandoLike) return;

  procesandoLike = true;
  botonLike.disabled = true;

  mostrarMensaje("Guardando tu apoyo...");

  try {
    const votoRef = ref(db, `${RUTA_LIKES}/${usuarioActual.uid}`);

    await set(votoRef, true);

    actualizarBotonLike(true);
    mostrarMensaje("¡Muchas gracias por tu apoyo!");
  } catch (error) {
    mostrarMensaje("No se pudo guardar tu like. Inténtalo nuevamente.");
    actualizarBotonLike(false);
  } finally {
    procesandoLike = false;
  }
});

iniciarLikes();
