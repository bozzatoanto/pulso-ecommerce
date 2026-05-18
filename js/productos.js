const productoCards = document.querySelectorAll(".producto-card");

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

let productoActivo = null;

function obtenerCantidad(card) {
  return Number(card.dataset.cantidad || 0);
}

function actualizarCantidad(card, cantidad) {
  const nuevaCantidad = Math.max(0, cantidad);
  card.dataset.cantidad = nuevaCantidad;

  const cantidadTexto = card.querySelector(".cantidad-producto");

  if (cantidadTexto) {
    cantidadTexto.textContent = nuevaCantidad;
  }

  if (productoActivo === card && modalCantidad) {
    modalCantidad.textContent = nuevaCantidad;
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

function agregarAlCarrito(card) {
  const cantidad = obtenerCantidad(card);
  const nombre = card.dataset.nombre;

  if (cantidad <= 0) {
    mostrarAvisoCarrito("Primero elegí una cantidad para agregar al carrito.");
    return;
  }

  mostrarAvisoCarrito(`${nombre} agregado al carrito. Cantidad: ${cantidad}`);
}

function abrirModal(card) {
  if (!productoModal || !modalSlider) return;

  productoActivo = card;

  const nombre = card.dataset.nombre;
  const descripcion = card.dataset.descripcion;
  const precioTexto = card.dataset.precioTexto;
  const cantidad = obtenerCantidad(card);

  modalTitulo.textContent = nombre;
  modalDescripcion.textContent = descripcion;
  modalPrecio.textContent = precioTexto;
  modalCantidad.textContent = cantidad;

  modalSlider.innerHTML = "";

  const imagenes = card.querySelectorAll(".producto-slider img");

  imagenes.forEach((imagen) => {
    const imgModal = document.createElement("img");
    imgModal.src = imagen.src;
    imgModal.alt = imagen.alt;
    modalSlider.appendChild(imgModal);
  });

  productoModal.classList.add("modal-activo");
}

function cerrarProductoModal() {
  if (!productoModal) return;

  productoModal.classList.remove("modal-activo");
  productoActivo = null;
}

productoCards.forEach((card) => {
  card.dataset.cantidad = card.dataset.cantidad || 0;

  const btnRestar = card.querySelector(".btn-restar");
  const btnSumar = card.querySelector(".btn-sumar");
  const btnCarrito = card.querySelector(".btn-carrito");

  card.addEventListener("click", function (event) {
    if (event.target.closest("button")) return;

    abrirModal(card);
  });

  if (btnRestar) {
    btnRestar.addEventListener("click", function (event) {
      event.stopPropagation();

      const cantidadActual = obtenerCantidad(card);
      actualizarCantidad(card, cantidadActual - 1);
    });
  }

  if (btnSumar) {
    btnSumar.addEventListener("click", function (event) {
      event.stopPropagation();

      const cantidadActual = obtenerCantidad(card);
      actualizarCantidad(card, cantidadActual + 1);
    });
  }

  if (btnCarrito) {
    btnCarrito.addEventListener("click", function (event) {
      event.stopPropagation();

      agregarAlCarrito(card);
    });
  }
});

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

    const cantidadActual = obtenerCantidad(productoActivo);
    actualizarCantidad(productoActivo, cantidadActual - 1);
  });
}

if (modalSumar) {
  modalSumar.addEventListener("click", function () {
    if (!productoActivo) return;

    const cantidadActual = obtenerCantidad(productoActivo);
    actualizarCantidad(productoActivo, cantidadActual + 1);
  });
}

if (modalAgregarCarrito) {
  modalAgregarCarrito.addEventListener("click", function () {
    if (!productoActivo) return;

    agregarAlCarrito(productoActivo);
  });
}