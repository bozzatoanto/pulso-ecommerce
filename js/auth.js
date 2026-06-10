window.usuarioEstaLogueado = function () {
  return sessionStorage.getItem("usuarioLogueado") === "true";
};

window.obtenerUsuarioLogueado = function () {
  return sessionStorage.getItem("usuarioEmail");
};

window.iniciarSesion = function (email) {
  sessionStorage.setItem("usuarioLogueado", "true");
  sessionStorage.setItem("usuarioEmail", email);
};

window.cerrarSesion = function () {
  sessionStorage.removeItem("usuarioLogueado");
  sessionStorage.removeItem("usuarioEmail");
};

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
      alert("Ingresá tu email y contraseña.");
      return;
    }

    window.iniciarSesion(email);

    window.location.href = "../index.html";
  });
}