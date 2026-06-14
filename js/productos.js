const productosGrid = document.getElementById("productosGrid");

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

let productos = [];
let productoActivo = null;
let cantidades = {};
let indiceImagenModal = 0;
let avisoLoginMostrado = false;

function estaEnCarpetaPages() {
  return window.location.pathname.includes("/pages/");
}

function obtenerRutaJson() {
  return estaEnCarpetaPages()
    ? "../data/productos.json"
    : "data/productos.json";
}

function obtenerRutaImagen(rutaImagen) {
  return estaEnCarpetaPages()
    ? `../img/${rutaImagen}`
    : `img/${rutaImagen}`;
}

function obtenerRutaLogin() {
  return estaEnCarpetaPages()
    ? "login.html"
    : "pages/login.html";
}

function usuarioTieneSesion() {
  return sessionStorage.getItem("usuarioLogueado") === "true";
}

function obtenerCategoriaActual() {
  if (!productosGrid) return null;

  return productosGrid.dataset.categoria;
}

async function cargarProductos() {
  try {
    const respuesta = await fetch(obtenerRutaJson());

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el archivo productos.json");
    }

    productos = await respuesta.json();

    renderizarProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error);

    if (productosGrid) {
      productosGrid.innerHTML = `
        <p class="mensaje-error-productos">
          No se pudieron cargar los productos.
        </p>
      `;
    }
  }
}

function renderizarProductos() {
  if (!productosGrid) return;

  const categoriaActual = obtenerCategoriaActual();

  if (!categoriaActual) return;

  const productosFiltrados = productos.filter((producto) => {
    return producto.categoria === categoriaActual;
  });

  productosGrid.innerHTML = productosFiltrados
    .map((producto) => crearCardProducto(producto))
    .join("");

  mostrarModalPreciosUnaVez();
}

function crearCardProducto(producto) {
  cantidades[producto.id] = cantidades[producto.id] || 0;

  const estaLogueado = usuarioTieneSesion();

  const imagenesHtml = producto.imagenes
    .map((imagen) => {
      return `
        <img src="${obtenerRutaImagen(imagen)}" alt="${producto.nombre}">
      `;
    })
    .join("");

  const flechasHtml =
    producto.imagenes.length > 1
      ? `
        <button class="producto-flecha producto-flecha-anterior" type="button" data-id="${producto.id}" data-accion-slider="anterior">
          ‹
        </button>

        <button class="producto-flecha producto-flecha-siguiente" type="button" data-id="${producto.id}" data-accion-slider="siguiente">
          ›
        </button>
      `
      : "";

  return `
    <article class="producto-card" data-id="${producto.id}">
      <div class="producto-slider-box">
        ${flechasHtml}

        <div class="producto-slider" id="slider-${producto.id}">
          ${imagenesHtml}
        </div>
      </div>

      <h3>${producto.nombre}</h3>

      ${estaLogueado ? `<p>${producto.precioTexto}</p>` : ""}

      ${
        estaLogueado
          ? `
            <div class="producto-acciones">
              <button class="btn-cantidad btn-restar" type="button" data-id="${producto.id}">-</button>
              <span class="cantidad-producto" id="cantidad-${producto.id}">${cantidades[producto.id]}</span>
              <button class="btn-cantidad btn-sumar" type="button" data-id="${producto.id}">+</button>
              <button class="btn-carrito" type="button" data-id="${producto.id}" aria-label="Agregar al carrito">🛒</button>
            </div>
          `
          : ""
      }
    </article>
  `;
}

function obtenerProductoPorId(idProducto) {
  return productos.find((producto) => {
    return String(producto.id) === String(idProducto);
  });
}

function actualizarCantidad(idProducto, nuevaCantidad) {
  cantidades[idProducto] = Math.max(0, nuevaCantidad);

  const cantidadCard = document.getElementById(`cantidad-${idProducto}`);

  if (cantidadCard) {
    cantidadCard.textContent = cantidades[idProducto];
  }

  if (
    productoActivo &&
    String(productoActivo.id) === String(idProducto) &&
    modalCantidad
  ) {
    modalCantidad.textContent = cantidades[idProducto];
  }
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

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem("carritoPulso");

  if (!carritoGuardado) {
    return [];
  }

  try {
    return JSON.parse(carritoGuardado);
  } catch (error) {
    console.error("Error al leer carrito:", error);
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem("carritoPulso", JSON.stringify(carrito));
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
  if (!usuarioTieneSesion()) {
    mostrarAvisoCarrito("Para agregar productos al carrito, iniciá sesión.");
    return;
  }

  const producto = obtenerProductoPorId(idProducto);

  if (!producto) {
    mostrarAvisoCarrito("No se encontró el producto.");
    return;
  }

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

function configurarModalSegunSesion(producto) {
  const estaLogueado = usuarioTieneSesion();
  const modalAcciones = document.querySelector(".modal-acciones");

  if (estaLogueado) {
    modalPrecio.innerHTML = producto.precioTexto;

    if (modalAcciones) {
      modalAcciones.style.display = "flex";
    }

    return;
  }

  modalPrecio.innerHTML = `
    <span class="modal-precio-bloqueado">
      Para ver precios,
      <a href="${obtenerRutaLogin()}">iniciá sesión</a>
    </span>
  `;

  if (modalAcciones) {
    modalAcciones.style.display = "none";
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
        <img src="${obtenerRutaImagen(imagen)}" alt="${producto.nombre}">
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
  modalCantidad.textContent = cantidades[producto.id] || 0;

  configurarModalSegunSesion(producto);
  cargarImagenesModal(producto);

  productoModal.classList.add("modal-activo");
}

function cerrarProductoModal() {
  if (!productoModal) return;

  productoModal.classList.remove("modal-activo");
  productoActivo = null;
  indiceImagenModal = 0;
}

function crearModalPreciosLogin() {
  const modalExistente = document.getElementById("modalPreciosLogin");

  if (modalExistente) return;

  const modal = document.createElement("div");

  modal.classList.add("modal-precios-login");
  modal.id = "modalPreciosLogin";

  modal.innerHTML = `
    <div class="modal-precios-card">
      <span class="modal-precios-tag">Acceso a precios</span>

      <h2>Iniciá sesión para ver precios</h2>

      <p>
        Podés seguir navegando los productos, pero para ver precios y agregar artículos al carrito necesitás iniciar sesión.
      </p>

      <div class="modal-precios-acciones">
        <button class="btn-seguir-viendo" id="seguirViendoProductos" type="button">
          Seguir viendo
        </button>

        <a class="btn-ir-login" href="${obtenerRutaLogin()}">
          Iniciar sesión
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const seguirViendoProductos = document.getElementById("seguirViendoProductos");

  seguirViendoProductos.addEventListener("click", cerrarModalPreciosLogin);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      cerrarModalPreciosLogin();
    }
  });
}

function mostrarModalPreciosUnaVez() {
  if (usuarioTieneSesion()) return;

  if (avisoLoginMostrado) return;

  crearModalPreciosLogin();

  const modal = document.getElementById("modalPreciosLogin");

  if (!modal) return;

  modal.classList.add("modal-precios-activo");
  avisoLoginMostrado = true;
}

function cerrarModalPreciosLogin() {
  const modal = document.getElementById("modalPreciosLogin");

  if (!modal) return;

  modal.classList.remove("modal-precios-activo");
}

function moverSliderCard(idProducto, accionSlider) {
  const slider = document.getElementById(`slider-${idProducto}`);

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

if (productosGrid) {
  productosGrid.addEventListener("click", function (event) {
    const botonSlider = event.target.closest(".producto-flecha");
    const botonSumar = event.target.closest(".btn-sumar");
    const botonRestar = event.target.closest(".btn-restar");
    const botonCarrito = event.target.closest(".btn-carrito");
    const card = event.target.closest(".producto-card");

    if (botonSlider) {
      event.stopPropagation();

      const idProducto = botonSlider.dataset.id;
      const accionSlider = botonSlider.dataset.accionSlider;

      moverSliderCard(idProducto, accionSlider);
      return;
    }

    if (botonSumar) {
      const idProducto = botonSumar.dataset.id;
      const cantidadActual = cantidades[idProducto] || 0;

      actualizarCantidad(idProducto, cantidadActual + 1);
      return;
    }

    if (botonRestar) {
      const idProducto = botonRestar.dataset.id;
      const cantidadActual = cantidades[idProducto] || 0;

      actualizarCantidad(idProducto, cantidadActual - 1);
      return;
    }

    if (botonCarrito) {
      const idProducto = botonCarrito.dataset.id;
      const cardProducto = botonCarrito.closest(".producto-card");

      agregarAlCarrito(idProducto, cardProducto);
      return;
    }

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

cargarProductos();