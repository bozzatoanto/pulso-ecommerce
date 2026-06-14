const header = document.querySelector("header");

function estaEnCarpetaPages() {
  return window.location.pathname.includes("/pages/");
}

function obtenerRuta(pagina) {
  return estaEnCarpetaPages() ? pagina.rutaDesdePages : pagina.rutaDesdeRoot;
}

function obtenerRutaLogo() {
  return estaEnCarpetaPages() ? "../img/icono.png" : "img/icono.png";
}

function obtenerRutaLogin() {
  return estaEnCarpetaPages() ? "login.html" : "pages/login.html";
}

function crearModalLogout() {
  const modalExistente = document.getElementById("modalConfirmacionLogout");

  if (modalExistente) return;

  const modal = document.createElement("div");

  modal.classList.add("modal-confirmacion-eliminar", "modal-logout");
  modal.id = "modalConfirmacionLogout";

  modal.innerHTML = `
    <div class="modal-confirmacion-card modal-logout-card">
      <span class="modal-confirmacion-tag modal-logout-tag">Cerrar sesión</span>

      <h2>¿Querés salir de tu cuenta?</h2>

      <p>
        Vas a cerrar tu sesión actual. Para volver a ver precios, agregar productos o acceder al carrito, vas a tener que iniciar sesión nuevamente.
      </p>

      <div class="modal-confirmacion-acciones">
        <button class="btn-cancelar-eliminar" id="cancelarLogout" type="button">
          Cancelar
        </button>

        <button class="btn-confirmar-eliminar" id="confirmarLogout" type="button">
          Sí, salir
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const cancelarLogout = document.getElementById("cancelarLogout");
  const confirmarLogout = document.getElementById("confirmarLogout");

  cancelarLogout.addEventListener("click", cerrarModalLogout);
  confirmarLogout.addEventListener("click", confirmarLogoutUsuario);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      cerrarModalLogout();
    }
  });
}

function abrirModalLogout() {
  crearModalLogout();

  const modal = document.getElementById("modalConfirmacionLogout");

  if (!modal) return;

  modal.classList.add("modal-confirmacion-activo");
}

function cerrarModalLogout() {
  const modal = document.getElementById("modalConfirmacionLogout");

  if (!modal) return;

  modal.classList.remove("modal-confirmacion-activo");
}

function confirmarLogoutUsuario() {
  window.cerrarSesion();
  window.location.href = obtenerRutaLogin();
}

function renderizarNavbar() {
  if (!header || !window.paginas || !window.usuarioEstaLogueado) return;

  const home = window.paginas.find((pagina) => pagina.titulo === "Home");
  const remeras = window.paginas.find((pagina) => pagina.titulo === "Remeras");
  const buzos = window.paginas.find((pagina) => pagina.titulo === "Buzos");
  const pantalones = window.paginas.find((pagina) => pagina.titulo === "Pantalones");
  const carrito = window.paginas.find((pagina) => pagina.titulo === "Carrito");
  const login = window.paginas.find((pagina) => pagina.titulo === "Login");
  const registro = window.paginas.find((pagina) => pagina.titulo === "Registro");

  const estaLogueado = window.usuarioEstaLogueado();

  header.innerHTML = `
    <nav class="navbar">
      <div class="logo">
        <a href="${obtenerRuta(home)}" class="logo-link">
          <img src="${obtenerRutaLogo()}" alt="Logo Pulso">
        </a>
      </div>

      <ul class="nav-links nav-left">
        <li><a href="${obtenerRuta(home)}">Home</a></li>

        <li class="dropdown">
          <a href="#">Categorías</a>
          <ul class="dropdown-menu">
            <li><a href="${obtenerRuta(remeras)}">Remeras</a></li>
            <li><a href="${obtenerRuta(buzos)}">Buzos</a></li>
            <li><a href="${obtenerRuta(pantalones)}">Pantalones</a></li>
          </ul>
        </li>
      </ul>

      <ul class="nav-links nav-right">
        ${
          estaLogueado
            ? `
              <li><a href="${obtenerRuta(carrito)}">Carrito</a></li>
              <li><a href="#" id="logoutBtn">Logout</a></li>
            `
            : `
              <li><a href="${obtenerRuta(login)}">Login</a></li>
              <li><a href="${obtenerRuta(registro)}">Registro</a></li>
            `
        }
      </ul>
    </nav>
  `;

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
      event.preventDefault();
      abrirModalLogout();
    });
  }
}

renderizarNavbar();