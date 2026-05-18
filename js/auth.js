window.usuarioEstaLogueado = function () {
  return localStorage.getItem("usuarioLogueado") === "true";
};

window.iniciarSesion = function () {
  localStorage.setItem("usuarioLogueado", "true");
};

window.cerrarSesion = function () {
  localStorage.removeItem("usuarioLogueado");
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

    window.iniciarSesion();

    window.location.href = "../index.html";
  });
}