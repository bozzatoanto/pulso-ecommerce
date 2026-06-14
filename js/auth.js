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
const registroForm = document.getElementById("registroForm");
const authSubmitButton = document.querySelector(".auth-submit-full");

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

if (registroForm) {
  registroForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const fecha = document.getElementById("fecha").value;

    if (
      nombre === "" ||
      apellido === "" ||
      email === "" ||
      password === "" ||
      fecha === ""
    ) {
      alert("Completá todos los campos.");
      return;
    }

    localStorage.setItem(
      "usuarioRegistradoPulso",
      JSON.stringify({
        nombre,
        apellido,
        email,
        fecha
      })
    );

    window.iniciarSesion(email);

    window.location.href = "../index.html";
  });
}

if (authSubmitButton) {
  authSubmitButton.addEventListener("mousemove", function (event) {
    const rect = authSubmitButton.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    authSubmitButton.style.setProperty("--mouse-x", `${x}px`);
    authSubmitButton.style.setProperty("--mouse-y", `${y}px`);
  });
}