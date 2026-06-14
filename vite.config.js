import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        remeras: resolve(__dirname, "pages/remeras.html"),
        buzos: resolve(__dirname, "pages/buzos.html"),
        pantalones: resolve(__dirname, "pages/pantalones.html"),
        carrito: resolve(__dirname, "pages/carrito.html"),
        login: resolve(__dirname, "pages/login.html"),
        registro: resolve(__dirname, "pages/registro.html")
      }
    }
  }
});