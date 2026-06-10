const carritoContenedor = document.getElementById("carritoContenedor");
const carritoTotal = document.getElementById("carritoTotal");

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
        <a href="buzos.html">Ver productos</a>
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
              <button class="btn-carrito-cantidad" data-accion="restar" data-id="${producto.id}">-</button>
              <span>${producto.cantidad}</span>
              <button class="btn-carrito-cantidad" data-accion="sumar" data-id="${producto.id}">+</button>
            </div>
          </div>

          <div class="carrito-subtotal">
            <strong>${formatearPrecio(producto.precio * producto.cantidad)}</strong>
            <button class="btn-eliminar-carrito" data-id="${producto.id}">Eliminar</button>
          </div>
        </article>
      `;
    })
    .join("");

  carritoTotal.textContent = formatearPrecio(calcularTotal(carrito));
}

function sumarCantidad(idProducto) {
  const carrito = obtenerCarrito();

  const producto = carrito.find((item) => item.id === idProducto);

  if (!producto) return;

  producto.cantidad++;

  guardarCarrito(carrito);
  renderizarCarrito();
}

function restarCantidad(idProducto) {
  let carrito = obtenerCarrito();

  const producto = carrito.find((item) => item.id === idProducto);

  if (!producto) return;

  producto.cantidad--;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter((item) => item.id !== idProducto);
  }

  guardarCarrito(carrito);
  renderizarCarrito();
}

function eliminarProducto(idProducto) {
  const carrito = obtenerCarrito();

  const carritoActualizado = carrito.filter((producto) => {
    return producto.id !== idProducto;
  });

  guardarCarrito(carritoActualizado);
  renderizarCarrito();
}

if (carritoContenedor) {
  carritoContenedor.addEventListener("click", function (event) {
    const botonCantidad = event.target.closest(".btn-carrito-cantidad");
    const botonEliminar = event.target.closest(".btn-eliminar-carrito");

    if (botonCantidad) {
      const idProducto = Number(botonCantidad.dataset.id);
      const accion = botonCantidad.dataset.accion;

      if (accion === "sumar") {
        sumarCantidad(idProducto);
      }

      if (accion === "restar") {
        restarCantidad(idProducto);
      }
    }

    if (botonEliminar) {
      const idProducto = Number(botonEliminar.dataset.id);

      eliminarProducto(idProducto);
    }
  });
}

renderizarCarrito();