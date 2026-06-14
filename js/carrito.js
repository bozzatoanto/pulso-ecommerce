const carritoContenedor = document.getElementById("carritoContenedor");
const carritoTotal = document.getElementById("carritoTotal");

let idProductoAEliminar = null;

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

function formatearPrecio(precio) {
  return `$${precio.toLocaleString("es-AR")}`;
}

function obtenerRutaImagenCarrito(imagen) {
  if (!imagen) {
    return ""; 
  }

  if (imagen.startsWith("../img/")) {
    return imagen;
  }

  if (imagen.startsWith("img/")) {
    return `../${imagen}`;
  }

  return `../img/${imagen}`;
}

function calcularTotal(carrito) {
  return carrito.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);
}

function renderizarCarrito() {
  const carrito = obtenerCarrito();

  if (!carritoContenedor || !carritoTotal) return;

  if (carrito.length === 0) {
    carritoContenedor.innerHTML = `
      <div class="carrito-vacio">
        <h2>Tu carrito está vacío</h2>
        <p>Agregá productos desde las categorías para verlos acá.</p>
        <a href="../index.html">Ver productos</a>
      </div>
    `;

    carritoTotal.textContent = "$0";
    return;
  }

  carritoContenedor.innerHTML = carrito
    .map((producto) => {
      return `
        <article class="carrito-item" data-id="${producto.id}">
          <img src="${obtenerRutaImagenCarrito(producto.imagen)}" alt="${producto.nombre}">

          <div class="carrito-info">
            <h3>${producto.nombre}</h3>
            <p>${producto.precioTexto}</p>

            <div class="carrito-cantidad">
              <button class="btn-carrito-cantidad" data-accion="restar" data-id="${producto.id}" type="button">-</button>
              <span>${producto.cantidad}</span>
              <button class="btn-carrito-cantidad" data-accion="sumar" data-id="${producto.id}" type="button">+</button>
            </div>
          </div>

          <div class="carrito-subtotal">
            <strong>${formatearPrecio(producto.precio * producto.cantidad)}</strong>
            <button class="btn-eliminar-carrito" data-id="${producto.id}" type="button">Eliminar</button>
          </div>
        </article>
      `;
    })
    .join("");

  carritoTotal.textContent = formatearPrecio(calcularTotal(carrito));
}

function sumarCantidad(idProducto) {
  const carrito = obtenerCarrito();

  const producto = carrito.find((item) => {
    return String(item.id) === String(idProducto);
  });

  if (!producto) return;

  producto.cantidad++;

  guardarCarrito(carrito);
  renderizarCarrito();
}

function restarCantidad(idProducto) {
  let carrito = obtenerCarrito();

  const producto = carrito.find((item) => {
    return String(item.id) === String(idProducto);
  });

  if (!producto) return;

  producto.cantidad--;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter((item) => {
      return String(item.id) !== String(idProducto);
    });
  }

  guardarCarrito(carrito);
  renderizarCarrito();
}

function crearModalConfirmacion() {
  const modalExistente = document.getElementById("modalConfirmacionEliminar");

  if (modalExistente) return;

  const modal = document.createElement("div");

  modal.classList.add("modal-confirmacion-eliminar");
  modal.id = "modalConfirmacionEliminar";

  modal.innerHTML = `
    <div class="modal-confirmacion-card">
      <span class="modal-confirmacion-tag">Confirmar acción</span>

      <h2>¿Eliminar producto?</h2>

      <p>
        Este producto se va a quitar del carrito. 
        Podés volver a agregarlo desde las categorías cuando quieras.
      </p>

      <div class="modal-confirmacion-acciones">
        <button class="btn-cancelar-eliminar" id="cancelarEliminar" type="button">
          Cancelar
        </button>

        <button class="btn-confirmar-eliminar" id="confirmarEliminar" type="button">
          Sí, eliminar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const cancelarEliminar = document.getElementById("cancelarEliminar");
  const confirmarEliminar = document.getElementById("confirmarEliminar");

  cancelarEliminar.addEventListener("click", cerrarModalConfirmacion);
  confirmarEliminar.addEventListener("click", confirmarEliminacionProducto);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      cerrarModalConfirmacion();
    }
  });
}

function abrirModalConfirmacion(idProducto) {
  idProductoAEliminar = idProducto;

  crearModalConfirmacion();

  const modal = document.getElementById("modalConfirmacionEliminar");

  if (!modal) return;

  modal.classList.add("modal-confirmacion-activo");
}

function cerrarModalConfirmacion() {
  const modal = document.getElementById("modalConfirmacionEliminar");

  if (!modal) return;

  modal.classList.remove("modal-confirmacion-activo");
  idProductoAEliminar = null;
}

function confirmarEliminacionProducto() {
  if (!idProductoAEliminar) return;

  const carrito = obtenerCarrito();

  const carritoActualizado = carrito.filter((producto) => {
    return String(producto.id) !== String(idProductoAEliminar);
  });

  guardarCarrito(carritoActualizado);
  renderizarCarrito();
  cerrarModalConfirmacion();
}

if (carritoContenedor) {
  carritoContenedor.addEventListener("click", function (event) {
    const botonCantidad = event.target.closest(".btn-carrito-cantidad");
    const botonEliminar = event.target.closest(".btn-eliminar-carrito");

    if (botonCantidad) {
      const idProducto = botonCantidad.dataset.id;
      const accion = botonCantidad.dataset.accion;

      if (accion === "sumar") {
        sumarCantidad(idProducto);
      }

      if (accion === "restar") {
        restarCantidad(idProducto);
      }
    }

    if (botonEliminar) {
      const idProducto = botonEliminar.dataset.id;

      abrirModalConfirmacion(idProducto);
    }
  });
}

crearModalConfirmacion();
renderizarCarrito();