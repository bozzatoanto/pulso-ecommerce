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

function estaEnCarpetaPages() {
  return window.location.pathname.includes("/pages/");
}

function obtenerRutaJson() {
  return "/data/productos.json";
}

function obtenerRutaImagen(rutaImagen) {
  return estaEnCarpetaPages()
    ? `../img/${rutaImagen}`
    : `img/${rutaImagen}`;
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
}

function crearCardProducto(producto) {
  cantidades[producto.id] = cantidades[producto.id] || 0;

  const imagenesHtml = producto.imagenes
    .map((imagen) => {
      return `
        <img src="${obtenerRutaImagen(imagen)}" alt="${producto.nombre}">
      `;
    })
    .join("");

  return `
    <article class="producto-card" data-id="${producto.id}">
      <div class="producto-slider">
        ${imagenesHtml}
      </div>

      <h3>${producto.nombre}</h3>
      <p>${producto.precioTexto}</p>

      <div class="producto-acciones">
        <button class="btn-cantidad btn-restar" type="button" data-id="${producto.id}">-</button>
        <span class="cantidad-producto" id="cantidad-${producto.id}">${cantidades[producto.id]}</span>
        <button class="btn-cantidad btn-sumar" type="button" data-id="${producto.id}">+</button>
        <button class="btn-carrito" type="button" data-id="${producto.id}" aria-label="Agregar al carrito">🛒</button>
      </div>
    </article>
  `;
}

function obtenerProductoPorId(idProducto) {
  return productos.find((producto) => producto.id === idProducto);
}

function actualizarCantidad(idProducto, nuevaCantidad) {
  cantidades[idProducto] = Math.max(0, nuevaCantidad);

  const cantidadCard = document.getElementById(`cantidad-${idProducto}`);

  if (cantidadCard) {
    cantidadCard.textContent = cantidades[idProducto];
  }

  if (productoActivo && productoActivo.id === idProducto && modalCantidad) {
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

  return JSON.parse(carritoGuardado);
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
  const producto = obtenerProductoPorId(idProducto);
  const cantidad = cantidades[idProducto] || 0;

  if (!producto) return;

  if (cantidad <= 0) {
    mostrarAvisoCarrito("Primero elegí una cantidad para agregar al carrito.");
    return;
  }

  const carrito = obtenerCarrito();

  const productoExistente = carrito.find((item) => {
    return item.id === producto.id;
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

  actualizarCantidad(idProducto, 0);

  if (elementoOrigen) {
    animarProductoAlCarrito(elementoOrigen);
  }
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

  modalSlider.innerHTML = producto.imagenes
    .map((imagen) => {
      return `
        <img src="${obtenerRutaImagen(imagen)}" alt="${producto.nombre}">
      `;
    })
    .join("");

  productoModal.classList.add("modal-activo");
}

function cerrarProductoModal() {
  if (!productoModal) return;

  productoModal.classList.remove("modal-activo");
  productoActivo = null;
}

if (productosGrid) {
  productosGrid.addEventListener("click", function (event) {
    const botonSumar = event.target.closest(".btn-sumar");
    const botonRestar = event.target.closest(".btn-restar");
    const botonCarrito = event.target.closest(".btn-carrito");
    const card = event.target.closest(".producto-card");

    if (botonSumar) {
      const idProducto = Number(botonSumar.dataset.id);
      const cantidadActual = cantidades[idProducto] || 0;

      actualizarCantidad(idProducto, cantidadActual + 1);
      return;
    }

    if (botonRestar) {
      const idProducto = Number(botonRestar.dataset.id);
      const cantidadActual = cantidades[idProducto] || 0;

      actualizarCantidad(idProducto, cantidadActual - 1);
      return;
    }

    if (botonCarrito) {
      const idProducto = Number(botonCarrito.dataset.id);
      const cardProducto = botonCarrito.closest(".producto-card");

      agregarAlCarrito(idProducto, cardProducto);
      return;
    }

    if (card) {
      const idProducto = Number(card.dataset.id);

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

    const imagenModal = modalSlider.querySelector("img");

    agregarAlCarrito(productoActivo.id, imagenModal);
  });
}

cargarProductos();