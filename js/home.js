const homeProductosLogueado = document.getElementById("homeProductosLogueado");
const homeProductosContenido = document.getElementById("homeProductosContenido");
const homeUsuarioTexto = document.getElementById("homeUsuarioTexto");
const showcaseHome = document.querySelector(".showcase");

const productoModal = document.getElementById("productoModal");
const cerrarModal = document.getElementById("cerrarModal");
const modalSlider = document.getElementById("modalSlider");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescripcion = document.getElementById("modalDescripcion");
const modalPrecio = document.getElementById("modalPrecio");
const modalCantidad = document.getElementById("modalCantidad");
const modalRestar = document.getElementById("modalRestar");
const modalSumar = document.getElementById("modalSumar");
const modalAgregarCarrito = document.getElementById("modalAgregarCarrito");

let productosHome = [];
let productoActivo = null;
let cantidades = {};
let indiceImagenModal = 0;

const categoriasHome = [
  {
    nombre: "Remeras",
    categoria: "remeras",
    ruta: "pages/remeras.html"
  },
  {
    nombre: "Buzos",
    categoria: "buzos",
    ruta: "pages/buzos.html"
  },
  {
    nombre: "Pantalones",
    categoria: "pantalones",
    ruta: "pages/pantalones.html"
  }
];

function obtenerRutaImagenHome(rutaImagen) {
  return `img/${rutaImagen}`;
}

function configurarVistaHome() {
  const estaLogueado = window.usuarioEstaLogueado && window.usuarioEstaLogueado();

  if (!estaLogueado) {
    if (homeProductosLogueado) {
      homeProductosLogueado.style.display = "none";
    }

    if (showcaseHome) {
      showcaseHome.style.display = "block";
    }

    return false;
  }

  if (showcaseHome) {
    showcaseHome.style.display = "none";
  }

  if (homeProductosLogueado) {
    homeProductosLogueado.style.display = "block";
  }

  return true;
}

async function cargarProductosHome() {
  if (!homeProductosLogueado || !homeProductosContenido) return;

  const puedeMostrarProductos = configurarVistaHome();

  if (!puedeMostrarProductos) return;

  try {
    const respuesta = await fetch("data/productos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar productos.json");
    }

    productosHome = await respuesta.json();

    if (homeUsuarioTexto) {
      homeUsuarioTexto.textContent = "Descubrí productos destacados de cada categoría.";
    }

    homeProductosContenido.innerHTML = categoriasHome
      .map((categoria) => {
        const productosCategoria = productosHome
          .filter((producto) => producto.categoria === categoria.categoria)
          .slice(0, 3);

        return `
          <article class="home-categoria-bloque">
            <div class="home-categoria-head">
              <h3>${categoria.nombre}</h3>
              <a href="${categoria.ruta}">Ver categoría</a>
            </div>

            <div class="home-productos-grid">
              ${productosCategoria
                .map((producto) => crearCardHome(producto, categoria.nombre))
                .join("")}
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error al cargar productos en home:", error);

    homeProductosContenido.innerHTML = `
      <p class="mensaje-error-productos">
        No se pudieron cargar los productos destacados.
      </p>
    `;
  }
}

function crearCardHome(producto, nombreCategoria) {
  cantidades[producto.id] = cantidades[producto.id] || 0;

  const imagenesHtml = producto.imagenes
    .map((imagen) => {
      return `
        <img src="${obtenerRutaImagenHome(imagen)}" alt="${producto.nombre}">
      `;
    })
    .join("");

  const flechasHtml =
    producto.imagenes.length > 1
      ? `
        <button class="home-producto-flecha home-producto-flecha-anterior" type="button" data-id="${producto.id}" data-accion-slider="anterior">
          ‹
        </button>

        <button class="home-producto-flecha home-producto-flecha-siguiente" type="button" data-id="${producto.id}" data-accion-slider="siguiente">
          ›
        </button>
      `
      : "";

  return `
    <article class="home-producto-card" data-id="${producto.id}">
      <div class="home-producto-slider-box">
        ${flechasHtml}

        <div class="home-producto-slider" id="home-slider-${producto.id}">
          ${imagenesHtml}
        </div>
      </div>

      <div class="home-producto-overlay">
        <span>${nombreCategoria}</span>
        <h4>${producto.nombre}</h4>
        <p>${producto.precioTexto}</p>
      </div>
    </article>
  `;
}

function obtenerProductoPorId(idProducto) {
  return productosHome.find((producto) => {
    return String(producto.id) === String(idProducto);
  });
}

function actualizarCantidad(idProducto, nuevaCantidad) {
  cantidades[idProducto] = Math.max(0, nuevaCantidad);

  if (
    productoActivo &&
    String(productoActivo.id) === String(idProducto) &&
    modalCantidad
  ) {
    modalCantidad.textContent = cantidades[idProducto];
  }
}

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem("carritoPulso");

  if (!carritoGuardado) {
    return [];
  }

  try {
    return JSON.parse(carritoGuardado);
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem("carritoPulso", JSON.stringify(carrito));
}

function mostrarAvisoCarrito(mensaje) {
  let aviso = document.querySelector(".aviso-carrito");

  if (!aviso) {
    aviso = document.createElement("div");
    aviso.classList.add("aviso-carrito");
    document.body.appendChild(aviso);
  }

  aviso.textContent = mensaje;
  aviso.classList.add("aviso-carrito-activo");

  setTimeout(() => {
    aviso.classList.remove("aviso-carrito-activo");
  }, 2200);
}

function obtenerImagenParaAnimacion(elementoOrigen) {
  if (!elementoOrigen) return null;

  if (elementoOrigen.tagName === "IMG") {
    return elementoOrigen;
  }

  return elementoOrigen.querySelector("img");
}

function animarProductoAlCarrito(elementoOrigen) {
  const imagenProducto = obtenerImagenParaAnimacion(elementoOrigen);
  const linkCarrito = document.querySelector('a[href$="carrito.html"]');

  if (!imagenProducto || !linkCarrito) return;

  const imagenRect = imagenProducto.getBoundingClientRect();
  const carritoRect = linkCarrito.getBoundingClientRect();

  const imagenClon = imagenProducto.cloneNode(true);

  imagenClon.classList.add("animacion-carrito-img");

  imagenClon.style.top = `${imagenRect.top}px`;
  imagenClon.style.left = `${imagenRect.left}px`;
  imagenClon.style.width = `${imagenRect.width}px`;
  imagenClon.style.height = `${imagenRect.height}px`;

  document.body.appendChild(imagenClon);

  requestAnimationFrame(() => {
    imagenClon.style.top = `${carritoRect.top + carritoRect.height / 2}px`;
    imagenClon.style.left = `${carritoRect.left + carritoRect.width / 2}px`;
    imagenClon.style.width = "28px";
    imagenClon.style.height = "28px";
    imagenClon.style.opacity = "0";
    imagenClon.style.transform = "scale(0.35) rotate(12deg)";
  });

  setTimeout(() => {
    imagenClon.remove();
  }, 850);
}

function agregarAlCarrito(idProducto, elementoOrigen = null) {
  const producto = obtenerProductoPorId(idProducto);

  if (!producto) return;

  const cantidad = cantidades[producto.id] || cantidades[idProducto] || 0;

  if (cantidad <= 0) {
    mostrarAvisoCarrito("Primero elegí una cantidad para agregar al carrito.");
    return;
  }

  const carrito = obtenerCarrito();

  const productoExistente = carrito.find((item) => {
    return String(item.id) === String(producto.id);
  });

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precioTexto: producto.precioTexto,
      imagen: producto.imagenes[0],
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
  actualizarCantidad(producto.id, 0);

  if (elementoOrigen) {
    animarProductoAlCarrito(elementoOrigen);
  }
}

function crearControlesImagenModal() {
  const modalContenido = document.querySelector(".modal-contenido");

  if (!modalContenido) return;

  if (document.getElementById("modalFlechaAnterior")) return;

  const botonAnterior = document.createElement("button");
  const botonSiguiente = document.createElement("button");

  botonAnterior.id = "modalFlechaAnterior";
  botonSiguiente.id = "modalFlechaSiguiente";

  botonAnterior.type = "button";
  botonSiguiente.type = "button";

  botonAnterior.classList.add("modal-flecha", "modal-flecha-anterior");
  botonSiguiente.classList.add("modal-flecha", "modal-flecha-siguiente");

  botonAnterior.textContent = "‹";
  botonSiguiente.textContent = "›";

  modalContenido.appendChild(botonAnterior);
  modalContenido.appendChild(botonSiguiente);

  botonAnterior.addEventListener("click", function (event) {
    event.stopPropagation();
    cambiarImagenModal(-1);
  });

  botonSiguiente.addEventListener("click", function (event) {
    event.stopPropagation();
    cambiarImagenModal(1);
  });
}

function actualizarControlesImagenModal() {
  const botonAnterior = document.getElementById("modalFlechaAnterior");
  const botonSiguiente = document.getElementById("modalFlechaSiguiente");

  if (!productoActivo || !botonAnterior || !botonSiguiente) return;

  const totalImagenes = productoActivo.imagenes.length;

  if (totalImagenes <= 1) {
    botonAnterior.style.display = "none";
    botonSiguiente.style.display = "none";
    return;
  }

  botonAnterior.style.display = "grid";
  botonSiguiente.style.display = "grid";
}

function moverSliderModal() {
  const imagenes = modalSlider.querySelectorAll("img");
  const imagenActual = imagenes[indiceImagenModal];

  if (!imagenActual) return;

  modalSlider.scrollTo({
    left: imagenActual.offsetLeft,
    behavior: "smooth"
  });

  actualizarControlesImagenModal();
}

function cambiarImagenModal(direccion) {
  if (!productoActivo) return;

  const totalImagenes = productoActivo.imagenes.length;

  indiceImagenModal += direccion;

  if (indiceImagenModal < 0) {
    indiceImagenModal = totalImagenes - 1;
  }

  if (indiceImagenModal >= totalImagenes) {
    indiceImagenModal = 0;
  }

  moverSliderModal();
}

function cargarImagenesModal(producto) {
  indiceImagenModal = 0;

  modalSlider.innerHTML = producto.imagenes
    .map((imagen) => {
      return `
        <img src="${obtenerRutaImagenHome(imagen)}" alt="${producto.nombre}">
      `;
    })
    .join("");

  crearControlesImagenModal();

  setTimeout(() => {
    moverSliderModal();
  }, 0);
}

function abrirModal(idProducto) {
  if (!productoModal || !modalSlider) return;

  const producto = obtenerProductoPorId(idProducto);

  if (!producto) return;

  productoActivo = producto;

  modalTitulo.textContent = producto.nombre;
  modalDescripcion.textContent = producto.descripcion;
  modalPrecio.textContent = producto.precioTexto;
  modalCantidad.textContent = cantidades[producto.id] || 0;

  cargarImagenesModal(producto);

  productoModal.classList.add("modal-activo");
}

function cerrarProductoModal() {
  if (!productoModal) return;

  productoModal.classList.remove("modal-activo");
  productoActivo = null;
  indiceImagenModal = 0;
}

function moverSliderHome(idProducto, accionSlider) {
  const slider = document.getElementById(`home-slider-${idProducto}`);

  if (!slider) return;

  const movimiento = slider.clientWidth;

  if (accionSlider === "siguiente") {
    slider.scrollBy({
      left: movimiento,
      behavior: "smooth"
    });
  }

  if (accionSlider === "anterior") {
    slider.scrollBy({
      left: -movimiento,
      behavior: "smooth"
    });
  }
}

if (homeProductosContenido) {
  homeProductosContenido.addEventListener("click", function (event) {
    const botonSlider = event.target.closest(".home-producto-flecha");
    const botonCategoria = event.target.closest(".home-categoria-head a");
    const card = event.target.closest(".home-producto-card");

    if (botonSlider) {
      event.preventDefault();
      event.stopPropagation();

      const idProducto = botonSlider.dataset.id;
      const accionSlider = botonSlider.dataset.accionSlider;

      moverSliderHome(idProducto, accionSlider);
      return;
    }

    if (botonCategoria) return;

    if (card) {
      const idProducto = card.dataset.id;

      abrirModal(idProducto);
    }
  });
}

if (cerrarModal) {
  cerrarModal.addEventListener("click", cerrarProductoModal);
}

if (productoModal) {
  productoModal.addEventListener("click", function (event) {
    if (event.target === productoModal) {
      cerrarProductoModal();
    }
  });
}

if (modalRestar) {
  modalRestar.addEventListener("click", function () {
    if (!productoActivo) return;

    const cantidadActual = cantidades[productoActivo.id] || 0;

    actualizarCantidad(productoActivo.id, cantidadActual - 1);
  });
}

if (modalSumar) {
  modalSumar.addEventListener("click", function () {
    if (!productoActivo) return;

    const cantidadActual = cantidades[productoActivo.id] || 0;

    actualizarCantidad(productoActivo.id, cantidadActual + 1);
  });
}

if (modalAgregarCarrito) {
  modalAgregarCarrito.addEventListener("click", function () {
    if (!productoActivo) return;

    const imagenesModal = modalSlider.querySelectorAll("img");
    const imagenModal = imagenesModal[indiceImagenModal] || modalSlider.querySelector("img");

    agregarAlCarrito(productoActivo.id, imagenModal);
  });
}

cargarProductosHome();
