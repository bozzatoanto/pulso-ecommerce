# Entrega Final - Trabajo Integrador - Aplicaciones Web 1

## Proyecto: Pulso Ecommerce

**Estudiante:** Antonella Bozzato
**Materia:** Aplicaciones Web 1
**Proyecto:** Tienda online de indumentaria urbana
**Repositorio GitHub:** https://github.com/bozzatoanto/pulso-ecommerce
**Link del proyecto publicado:** 
**Link del video explicativo:** 

---

## 1. Descripción general del proyecto

Pulso Ecommerce es una tienda online de indumentaria urbana desarrollada como trabajo integrador final para la materia Aplicaciones Web 1.

El sitio permite navegar productos por categorías, visualizar detalles de cada prenda, iniciar sesión, registrarse, ver precios solo cuando el usuario está logueado, agregar productos al carrito y administrar cantidades desde la vista de carrito.

El proyecto fue desarrollado con una estructura modular, separando HTML, CSS, JavaScript y datos en formato JSON, con el objetivo de simular el funcionamiento de un ecommerce real de forma simple, clara y funcional.

---

## 2. Roadmap de Desarrollo

### Etapa 1: Estructura inicial del sitio

En la primera etapa se definió la estructura general del proyecto. Se crearon las páginas principales del sitio:

* Home.
* Remeras.
* Buzos.
* Pantalones.
* Login.
* Registro.
* Carrito.

También se organizó la estructura de carpetas del proyecto, separando los archivos en:

* `css/`
* `js/`
* `data/`
* `img/`
* `pages/`

Esta organización permitió mantener el código más ordenado y facilitar futuras modificaciones.

---

### Etapa 2: Diseño visual y navegación

Luego se trabajó en la identidad visual del sitio, utilizando una estética oscura, moderna y orientada a una marca de ropa urbana.

Se desarrolló una barra de navegación reutilizable, que luego fue reemplazada por una navbar dinámica generada desde JavaScript. Esto permitió evitar repetir el mismo código en cada archivo HTML.

La navegación incluye acceso al Home, categorías, Login, Registro, Carrito y Logout, según el estado de sesión del usuario.

---

### Etapa 3: Carga dinámica de productos

En una etapa posterior, los productos dejaron de estar escritos directamente en el HTML y pasaron a cargarse desde un archivo externo:

`data/productos.json`

Cada producto contiene información como:

* ID.
* Nombre.
* Categoría.
* Descripción.
* Precio.
* Imágenes.

Esto permitió que las páginas de categoría carguen productos dinámicamente según el valor de `data-categoria`.

Por ejemplo:

* `remeras.html` muestra productos de la categoría `remeras`.
* `buzos.html` muestra productos de la categoría `buzos`.
* `pantalones.html` muestra productos de la categoría `pantalones`.

---

### Etapa 4: Sistema de login y registro

Se incorporó un sistema de autenticación básico utilizando `sessionStorage`.

El usuario puede iniciar sesión desde la página de Login. Al hacerlo, se guarda el estado de sesión en el navegador y cambia la navegación del sitio.

También se agregó una página de Registro, que permite crear una cuenta simulada. Al completar el formulario, los datos se guardan en `localStorage` y el usuario inicia sesión automáticamente, redirigiéndose al Home.

El objetivo de esta etapa fue simular una experiencia de usuario más realista, diferenciando las acciones disponibles para usuarios logueados y no logueados.

---

### Etapa 5: Control de acceso a precios y carrito

Se implementó una lógica para que los usuarios no logueados puedan navegar el sitio y ver los productos, pero sin acceder a precios ni funciones de compra.

Cuando el usuario no está logueado:

* Puede ver las categorías.
* Puede ver las imágenes, nombres y descripciones.
* No puede ver precios.
* No puede agregar productos al carrito.
* No visualiza el acceso al carrito en la navbar.

Cuando el usuario está logueado:

* Puede ver precios.
* Puede abrir el detalle completo de cada producto.
* Puede seleccionar cantidades.
* Puede agregar productos al carrito.
* Puede acceder a la vista del carrito.

---

### Etapa 6: Carrito de compras

Se desarrolló un carrito de compras utilizando `localStorage`, guardando los productos bajo la clave:

`carritoPulso`

El carrito permite:

* Ver productos agregados.
* Ver imagen, nombre, precio y subtotal.
* Sumar o restar cantidades.
* Eliminar productos.
* Calcular el total general.
* Mantener los productos guardados aunque se recargue la página.

También se agregó un modal de confirmación al eliminar productos, para evitar borrados accidentales.

---

### Etapa 7: Mejoras visuales e interacción

En la última etapa se trabajaron mejoras de experiencia de usuario y detalles visuales.

Se incorporaron:

* Modales de detalle de producto.
* Sliders de imágenes en cards y modal.
* Flechas para recorrer imágenes.
* Animación visual al agregar un producto al carrito.
* Modal de confirmación al hacer Logout.
* Botones con animación interactiva.
* Iconos en formularios.
* Diseño mejorado para Login y Registro.
* Corrección del carrito para mostrar correctamente los productos guardados.

Estas mejoras hicieron que el sitio se sienta más completo, funcional y cercano a una experiencia real de ecommerce.

---

## 3. Tecnologías Utilizadas

### HTML5

Se utilizó HTML5 para estructurar las páginas del sitio. Cada sección fue organizada de forma semántica, utilizando etiquetas como `header`, `main`, `section`, `article` y `form`.

HTML permitió definir la base del proyecto, los formularios, las páginas de categorías, la estructura del carrito y los contenedores donde luego JavaScript renderiza contenido dinámico.

---

### CSS3

CSS3 se utilizó para desarrollar toda la estética visual del sitio.

Se trabajaron aspectos como:

* Diseño responsive.
* Efecto glassmorphism.
* Fondos oscuros con gradientes.
* Cards de productos.
* Modales.
* Botones animados.
* Sliders visuales.
* Estados hover.
* Distribución de grillas.
* Formularios de Login y Registro.

CSS fue clave para mejorar la experiencia visual del usuario y darle identidad al ecommerce.

---

### JavaScript

JavaScript fue la tecnología principal para agregar funcionalidad dinámica al proyecto.

Se utilizó para:

* Cargar productos desde JSON.
* Renderizar cards de productos.
* Filtrar productos por categoría.
* Controlar modales.
* Manejar sliders.
* Gestionar cantidades.
* Agregar productos al carrito.
* Guardar información en `localStorage`.
* Manejar sesiones con `sessionStorage`.
* Crear la navbar dinámica.
* Validar acciones del usuario según esté logueado o no.

---

### JSON

Se incorporó un archivo JSON para almacenar la información de los productos.

Esta decisión permitió separar los datos del HTML, logrando un proyecto más ordenado y escalable.

El archivo `productos.json` funciona como una base de datos simple para el sitio.

---

### LocalStorage

Se utilizó `localStorage` para guardar información persistente en el navegador.

Se usó principalmente para:

* Guardar el carrito.
* Mantener productos agregados aunque se recargue la página.
* Guardar datos básicos del usuario registrado.

Esto permitió simular una experiencia de ecommerce más realista.

---

### SessionStorage

Se utilizó `sessionStorage` para controlar la sesión activa del usuario.

Cuando el usuario inicia sesión o se registra, se guarda temporalmente el estado de sesión. Al cerrar sesión, esos datos se eliminan.

Esto permitió modificar la interfaz según el estado del usuario.

---

### Vite

Se utilizó Vite como entorno de desarrollo local.

Vite facilita levantar el proyecto con un servidor local y permite trabajar correctamente con rutas, archivos estáticos y carga de datos mediante `fetch()`.

---

## 4. Tecnología adicional incorporada

Una tecnología adicional importante incorporada al proyecto fue el uso de `localStorage` y `sessionStorage`.

Si bien no se trabajó con una base de datos real ni backend, estas herramientas permitieron simular funcionalidades propias de una aplicación web más completa.

### Justificación de uso

Se eligieron porque permiten guardar información directamente en el navegador sin necesidad de configurar un servidor o base de datos externa.

### Funcionalidades que aportan

`localStorage` permitió guardar el carrito y conservar los productos agregados.

`sessionStorage` permitió controlar si el usuario está logueado o no durante la sesión activa.

### Integración al proyecto

Ambas tecnologías fueron integradas desde JavaScript. El carrito utiliza `localStorage`, mientras que el login y logout utilizan `sessionStorage`.

---

## 5. Mejora Significativa

La mejora significativa principal del proyecto fue la transformación de un sitio estático en una experiencia de ecommerce dinámica y funcional.

En las primeras etapas, el sitio se enfocaba principalmente en mostrar páginas y productos. En la versión final, se incorporaron funcionalidades más completas:

* Productos cargados dinámicamente desde JSON.
* Sistema de login.
* Registro con inicio de sesión automático.
* Navbar dinámica según el estado del usuario.
* Restricción de precios para usuarios no logueados.
* Carrito persistente con `localStorage`.
* Modales de detalle de producto.
* Sliders de imágenes en productos.
* Confirmación antes de eliminar productos.
* Confirmación antes de cerrar sesión.
* Animación al agregar productos al carrito.

Esta mejora impacta directamente en la experiencia de usuario, ya que el sitio ahora permite navegar, interactuar, seleccionar productos, guardar un carrito y simular un flujo de compra básico.

También representa una mejora en la organización del código, porque las responsabilidades fueron separadas en distintos archivos JavaScript:

* `auth.js`
* `navbar.js`
* `productos.js`
* `home.js`
* `carrito.js`
* `data.js`

Esto facilita el mantenimiento y la lectura del proyecto.

---

## 6. Funcionamiento del sitio

### Usuario no logueado

Cuando el usuario no inició sesión:

* Puede ver el Home.
* Puede navegar las categorías.
* Puede ver productos.
* Puede abrir el detalle de productos.
* No puede ver precios.
* No puede agregar productos al carrito.
* No ve el acceso al carrito en la navegación.

Este comportamiento se implementó para simular una tienda donde los precios y compras están disponibles solo para usuarios registrados.

---

### Usuario logueado

Cuando el usuario inicia sesión:

* Se muestran productos destacados en el Home.
* Se muestran precios.
* Aparece el acceso al carrito.
* Aparece la opción de Logout.
* Puede seleccionar cantidades.
* Puede agregar productos al carrito.
* Puede ver y modificar el carrito.

---

### Registro

El formulario de registro permite crear una cuenta simulada. Al completar los campos y enviar el formulario:

* Se guardan los datos en `localStorage`.
* Se inicia sesión automáticamente.
* El usuario es redirigido al Home.

---

### Carrito

El carrito muestra los productos agregados y permite:

* Ver detalle del producto agregado.
* Modificar cantidades.
* Eliminar productos.
* Ver subtotal por producto.
* Ver total general.

---

### Logout

Al tocar Logout, se muestra un modal de confirmación. Si el usuario confirma, se elimina la sesión y vuelve a la pantalla de Login.

---

## 7. Publicación

El proyecto fue subido a un repositorio público de GitHub y publicado en una plataforma web para que pueda ser accedido desde cualquier navegador.

**Repositorio:** https://github.com/bozzatoanto/pulso-ecommerce
**Proyecto publicado:** 

---

## 8. Video explicativo

El video explicativo incluye un recorrido por el sitio y muestra las funcionalidades principales:

* Home.
* Navbar.
* Categorías.
* Vista de productos.
* Modal de detalle.
* Login.
* Registro.
* Vista de usuario logueado.
* Agregado al carrito.
* Vista del carrito.
* Eliminación de productos.
* Logout.

**Link del video:** 

---

## 9. Reflexión personal

Durante el desarrollo de este proyecto pude aplicar distintos conceptos trabajados en la materia, como estructura HTML, estilos CSS, manipulación del DOM, eventos, almacenamiento local y organización de archivos.

Al comienzo, el proyecto partió como una página más estática, pero con el avance de las etapas se fue transformando en una tienda más funcional.

Una de las partes más desafiantes fue coordinar el funcionamiento entre distintas páginas y archivos JavaScript, especialmente para mantener el carrito, la sesión del usuario y la visualización dinámica de productos.

La parte que más disfruté fue mejorar la experiencia visual e interactiva del sitio, agregando modales, sliders, animaciones y una interfaz más cuidada.

Este trabajo me permitió comprender mejor cómo se organiza una aplicación web simple y cómo conectar distintas funcionalidades para lograr una experiencia más completa para el usuario.

---

## 10. Conclusión

Pulso Ecommerce cumple con los objetivos del trabajo integrador final, ya que presenta un sitio funcional, navegable, publicado y con mejoras significativas respecto a las entregas anteriores.

El proyecto integra estructura, diseño, lógica, manejo de datos, almacenamiento local y control de sesión, logrando una experiencia de ecommerce simple pero completa.
