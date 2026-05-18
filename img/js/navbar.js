const header = document.querySelector("header");

function estaEnCarpetaPages() {
  return window.location.pathname.includes("/pages/");
}

function obtenerRuta(pagina) {
  return estaEnCarpetaPages() ? pagina.rutaDesdePages : pagina.rutaDesdeRoot;
}

function obtenerRutaLogo() {
  return estaEnCarpetaPages() ? "../img/favicon.png" : "img/favicon.png";
}

function renderizarNavbar() {
  if (!header || !window.paginas) return;

  const home = window.paginas.find((pagina) => pagina.titulo === "Home");
  const remeras = window.paginas.find((pagina) => pagina.titulo === "Remeras");
  const buzos = window.paginas.find((pagina) => pagina.titulo === "Buzos");
  const pantalones = window.paginas.find((pagina) => pagina.titulo === "Pantalones");
  const login = window.paginas.find((pagina) => pagina.titulo === "Login");
  const registro = window.paginas.find((pagina) => pagina.titulo === "Registro");

  const estaLogueado = window.usuarioEstaLogueado();

  header.innerHTML = `
    <nav class="navbar">
      <div class="logo">
        <a href="${obtenerRuta(home)}">
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
            ? `<li><a href="#" id="logoutBtn">Logout</a></li>`
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

      window.cerrarSesion();

      if (estaEnCarpetaPages()) {
        window.location.href = "login.html";
      } else {
        window.location.href = "pages/login.html";
      }
    });
  }
}

renderizarNavbar();