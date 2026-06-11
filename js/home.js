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
    const respuesta = await fetch("/data/productos.json");

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
                .map((producto) => {
                  cantidades[producto.id] = cantidades[producto.id] || 0;

                  return `
                    <article class="home-producto-card" data-id="${producto.id}">
                      <img src="${obtenerRutaImagenHome(producto.imagenes[0])}" alt="${producto.nombre}">

                      <div class="home-producto-overlay">
                        <span>${categoria.nombre}</span>
                        <h4>${producto.nombre}</h4>
                        <p>${producto.precioTexto}</p>
                      </div>
                    </article>
                  `;
                })
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

function obtenerProductoPorId(idProducto) {
  return productosHome.find((producto) => producto.id === idProducto);
}

function actualizarCantidad(idProducto, nuevaCantidad) {
  cantidades[idProducto] = Math.max(0, nuevaCantidad);

  if (productoActivo && productoActivo.id === idProducto && modalCantidad) {
    modalCantidad.textContent = cantidades[idProducto];
  }
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

function animarProductoAlCarrito(elementoOrigen) {
  if (!elementoOrigen) return;

  const imagenProducto = elementoOrigen.tagName === "IMG"
    ? elementoOrigen
    : elementoOrigen.querySelector("img");

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
        <img src="${obtenerRutaImagenHome(imagen)}" alt="${producto.nombre}">
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

if (homeProductosContenido) {
  homeProductosContenido.addEventListener("click", function (event) {
    const botonCategoria = event.target.closest(".home-categoria-head a");

    if (botonCategoria) return;

    const card = event.target.closest(".home-producto-card");

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

cargarProductosHome();
