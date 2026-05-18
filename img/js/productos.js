const cardsProductos = document.querySelectorAll(".producto-card");

const productoModal = document.getElementById("productoModal");
const cerrarModal = document.getElementById("cerrarModal");

const modalSlider = document.getElementById("modalSlider");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescripcion = document.getElementById("modalDescripcion");
const modalPrecio = document.getElementById("modalPrecio");

const modalRestar = document.getElementById("modalRestar");
const modalSumar = document.getElementById("modalSumar");
const modalCantidad = document.getElementById("modalCantidad");
const modalAgregarCarrito = document.getElementById("modalAgregarCarrito");

let productoActivo = null;
let cantidadModal = 0;

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");

  if (!carritoGuardado) {
    return [];
  }

  return JSON.parse(carritoGuardado);
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
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

function obtenerDatosProducto(card) {
  const imagenes = Array.from(card.querySelectorAll(".producto-slider img")).map((imagen) => {
    return {
      src: imagen.src,
      alt: imagen.alt
    };
  });

  return {
    nombre: card.dataset.nombre,
    precio: Number(card.dataset.precio),
    precioTexto: card.dataset.precioTexto,
    descripcion: card.dataset.descripcion,
    imagen: imagenes[0].src,
    imagenes: imagenes
  };
}

function agregarProductoAlCarrito(producto, cantidad) {
  const carrito = obtenerCarrito();

  const productoExistente = carrito.find((item) => item.nombre === producto.nombre);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carrito.push({
      nombre: producto.nombre,
      precio: producto.precio,
      precioTexto: producto.precioTexto,
      imagen: producto.imagen,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
}

function abrirModal(producto) {
  productoActivo = producto;
  cantidadModal = 0;

  modalSlider.innerHTML = producto.imagenes
    .map((imagen) => {
      return `<img src="${imagen.src}" alt="${imagen.alt}">`;
    })
    .join("");

  modalTitulo.textContent = producto.nombre;
  modalDescripcion.textContent = producto.descripcion;
  modalPrecio.textContent = producto.precioTexto;
  modalCantidad.textContent = cantidadModal;

  productoModal.classList.add("modal-activo");
}

function cerrarProductoModal() {
  productoModal.classList.remove("modal-activo");
  productoActivo = null;
  cantidadModal = 0;
}

cardsProductos.forEach((card) => {
  let cantidadCard = 0;

  const cantidadTexto = card.querySelector(".cantidad-producto");
  const btnSumar = card.querySelector(".btn-sumar");
  const btnRestar = card.querySelector(".btn-restar");
  const btnCarrito = card.querySelector(".btn-carrito");

  btnSumar.addEventListener("click", (event) => {
    event.stopPropagation();

    cantidadCard++;
    cantidadTexto.textContent = cantidadCard;
  });

  btnRestar.addEventListener("click", (event) => {
    event.stopPropagation();

    if (cantidadCard > 0) {
      cantidadCard--;
      cantidadTexto.textContent = cantidadCard;
    }
  });

  btnCarrito.addEventListener("click", (event) => {
    event.stopPropagation();

    if (cantidadCard === 0) {
      mostrarAvisoCarrito("Seleccioná una cantidad antes de agregar al carrito.");
      return;
    }

    const producto = obtenerDatosProducto(card);

    agregarProductoAlCarrito(producto, cantidadCard);

    cantidadCard = 0;
    cantidadTexto.textContent = cantidadCard;
  });

  card.addEventListener("click", () => {
    const producto = obtenerDatosProducto(card);
    abrirModal(producto);
  });
});

modalSumar.addEventListener("click", () => {
  cantidadModal++;
  modalCantidad.textContent = cantidadModal;
});

modalRestar.addEventListener("click", () => {
  if (cantidadModal > 0) {
    cantidadModal--;
    modalCantidad.textContent = cantidadModal;
  }
});

modalAgregarCarrito.addEventListener("click", () => {
  if (cantidadModal === 0) {
    mostrarAvisoCarrito("Seleccioná una cantidad antes de agregar al carrito.");
    return;
  }

  agregarProductoAlCarrito(productoActivo, cantidadModal);

  cantidadModal = 0;
  modalCantidad.textContent = cantidadModal;
});

cerrarModal.addEventListener("click", cerrarProductoModal);

productoModal.addEventListener("click", (event) => {
  if (event.target === productoModal) {
    cerrarProductoModal();
  }
});