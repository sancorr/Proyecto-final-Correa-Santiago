const sectionProducts = document.querySelector("#cardsCelulares");

let servDB = []

/* Consumo datos desde JSON y creo las cards dinamicamente */

fetch("./db/db.json")
.then(response => response.json())
.then(data => {
  //console.log(data);
  servDB = data
  //console.log(servDB);
  
  /* Funcion que crea las cards con el array celulares */
  crearHtml(servDB);
}
);



//Funcion Correcta que buscar un celular en el array y devuelve el que coincida con el Id del boton corresponiente.
function buscarCelular(arr, id) {
  // Utiliza un bucle para iterar sobre cada celular en el arry
  for (const celular of arr) {
    // Comprueba si el ID del celular coincide con el ID que busco
    if (celular.id === id) {
      // Si se encuentra el celular, devuélvelo
      return celular;
    }
  }
  // Si no se encuentra el celular, devuelve null
  return null;
}

/* Funcion guardar en localStorage */
function guardarEnLS(arr) {
  localStorage.setItem("carritoCompras", JSON.stringify(arr));
}

const carritoLink = document.getElementById("carritoLink");
const carritoMenu = document.getElementById("carritoMenu");

// Actualizar el contador en el ícono de carrito
function actualizarContadorCarrito() {

  const carritoLSString = localStorage.getItem("carritoCompras");
  /* verifico si carritoLSString tiene un valor truthy, porque surgio el problema que el valor de la clave en LS era undefined.
  Si es así, parsea carritoLSString y lo asigna a carritoLS, de lo contrario, asigna un array vacío a carritoLS y aseguro el funcionamiento.
  Ademas aplico sintaxis avanzada. */
  const carritoLS = carritoLSString ? JSON.parse(carritoLSString) : [];
  const cantidadTotal = carritoLS.length;
  const contadorCarrito = carritoLink.querySelector("span");
  

  if (cantidadTotal > 0) {
    
    contadorCarrito.textContent = cantidadTotal;
    contadorCarrito.style.display = "inline"; 
    
  } else {
    contadorCarrito.style.display = "none";
    
  }
}
/* Llamo a la funcion antes de que se cargue por primera vez en el DOM para evitar que se pinte el contador por defecto en el DOM */
actualizarContadorCarrito()


/* Variable para controlar si el menú lateral está visible o no */
let carritoMenuVisible = false;

/*  Función para mostrar u ocultar el menú lateral del carrito */
function toggleMenuCarrito() {
  if (carritoMenu.classList.contains("mostrar")) {
    /* Si el menú del carrito está visible, lo oculto */
    carritoMenu.classList.remove("mostrar");
  } else {
    /* Si el menú del carrito está oculto, lo muestro */
    carritoMenu.classList.add("mostrar");
    /* Pintar el carrito cuando se muestre el menú lateral */
    pintarCarrito();
  }
}



/* Función para pintar los elementos del carrito en la tabla */
function pintarCarrito() {

  const carritoMenu = document.getElementById("carritoMenu");
  const carritoLS = JSON.parse(localStorage.getItem("carritoCompras")) || [];
  
  /* Limpiar el contenido anterior del carrito lateral */
  carritoMenu.innerHTML = "";

  if (carritoLS.length > 0) {

    let precioTotal = 0;

    /* Recorro los obj en LS, si existen, para pintar el carrito */
    carritoLS.forEach((e) => {
      const itemCarrito = document.createElement("div");
      itemCarrito.classList.add("item-carrito");
      itemCarrito.innerHTML = `
        <img src="../img/${e.img}" alt="${e.celular}">
        <div class="detalle-carrito">
          <p>${e.celular}</p>
          <p>Precio: $${e.precio}</p>
        </div>
        <button class="btn-quitar" data-id="${e.id}">Quitar</button>
      `;
      carritoMenu.appendChild(itemCarrito);

      /* Calcular el precio total del carrito */
      precioTotal += e.precio;
    });

    /* Mostrar el precio total del carrito */
    const totalCarrito = document.createElement("div");
    totalCarrito.classList.add("total-carrito");
    totalCarrito.innerHTML = `<p class="precioTotal">Total: $${precioTotal}</pc>`;
    carritoMenu.appendChild(totalCarrito);

    /* Agregar el botón de "Finalizar Compra" */
    const finalizarCompraBtn = document.createElement("button");
    finalizarCompraBtn.id = "finalizarCompraBtn";
    finalizarCompraBtn.classList.add("btn", "btn-primary");
    finalizarCompraBtn.textContent = "Ir a comprar";
    carritoMenu.appendChild(finalizarCompraBtn);

    /* Obtener referencia al botón de finalizar compra */
    const finalizarCompraBoton = document.getElementById("finalizarCompraBtn");


   /* Agregar evento de clic al botón de finalizar compra */
    finalizarCompraBoton.addEventListener('click', () => {
  
      window.location.href = "../pages/finalizarCompra.html";
    });

    const botonesQuitar = document.querySelectorAll(".btn-quitar");
    botonesQuitar.forEach((boton) => {
      boton.addEventListener("click", (e) => {
       const celularID = e.target.getAttribute("data-id");
       const productoAEliminar = carritoLS.find(producto => producto.id === celularID);
       if (productoAEliminar) {
         const nuevoCarrito = carritoLS.filter(producto => producto !== productoAEliminar);
         localStorage.setItem("carritoCompras", JSON.stringify(nuevoCarrito));
         pintarCarrito();
         actualizarContadorCarrito();
       }
     });
   });

  } else {
    carritoMenu.innerHTML = '<p class="carritoVacio">El carrito está vacío</p>';
    actualizarContadorCarrito();
  }
}

/*  Evento de clic en el ícono de carrito para mostrar/ocultar el menú lateral */
carritoLink.addEventListener("click", () => {
  /* Llama a la función toggleMenuCarrito para mostrar u ocultar el menú lateral */
  toggleMenuCarrito();
});



/* variable que obtiene el objeto desde LS, finalmente decidi no usarla, pero la dejo por si a futuro me sirve implementarla
let carritoLS = JSON.parse(localStorage.getItem('carritoCompras')); */

//Array de objetos guardados en LS o vacio si no tiene nada guardado para el carrito

let carrito = JSON.parse(localStorage.getItem("carritoCompras")) || [];

/* Ejecucion de funcion que guarda el array en LS */
guardarEnLS(carrito);

/* Función que pinta las cards en el DOM */
function crearHtml(arr) {
  sectionProducts.innerHTML = "";

  arr.forEach((el) => {
    const html = `
      <div class="card">
        <img src="../img/${el.img}" class="card-img-top" alt="${el.celular}">
        <div class="card-body">
          <h5 class="card-title">${el.celular}</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content. 
          <hr>
          $${el.precio}</p>
          <a class="btn btn-primary agregarCarrito" data-id="${el.id}">Agregar al carrito</a>
        </div>
      </div>`;
    sectionProducts.innerHTML += html;
    agregarEventoAgregarAlCarrito()
  });
}

/* Ejecucion de funcion que pinta las CARDS en el DOM */
crearHtml(servDB);


/* Funcion para filtrar celulares por barra de busqueda */
function filtrarPorNombre(nombre) {
  return servDB.filter((celular) =>
    celular.celular.toLowerCase().includes(nombre.toLowerCase())
  );
}

/* Obtener referencia al botón de búsqueda y asignarlo a una const */
const searchButton = document.getElementById("searchButton");

/* Obtener referencia a la barra de búsqueda y asignarlo a una const */
const searchInput = document.getElementById("searchInput");

/* Función para pintar el resultado de la búsqueda y agregar evento de clic a los botones "Agregar al carrito" */
function pintarResultadoBusquedaYAgregarEvento(resultado) {
  const sectionCards = document.querySelector("#cardsCelulares");
  sectionCards.innerHTML = ""; // Limpiar el contenido anterior

  if (resultado.length > 0) {
     /* Si se encuentra al menos un resultado, pintar todas las tarjetas */
    resultado.forEach((celular) => {
      const html = `
                <div class="card">
                    <img src="../img/${celular.img}" class="card-img-top" alt="${celular.celular}">
                    <div class="card-body">
                        <h5 class="card-title">${celular.celular}</h5>
                        <p class="card-text">Precio: $${celular.precio}</p>
                        <a href="#" class="btn btn-primary agregarCarrito" data-id="${celular.id}">Agregar al carrito</a>
                    </div>
                </div>`;
      sectionCards.innerHTML += html;
    });
    /* Después de pintar los resultados de búsqueda, agregar evento de clic a los botones "Agregar al carrito" */
    agregarEventoAgregarAlCarrito();
  } else {
    /* Si no se encuentra ningún resultado, mostrar un mensaje */
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ningún elemento coincide con la búsqueda.'
    });
    
    /* Pintar las tarjetas aunque no haya resultados, para evitar que el usuario realice alguna accion para volver a mostrarlas. */
    servDB.forEach((celular) => {
      const html = `
                <div class="card">
                    <img src="../img/${celular.img}" class="card-img-top" alt="${celular.celular}">
                    <div class="card-body">
                        <h5 class="card-title">${celular.celular}</h5>
                        <p class="card-text">Precio: $${celular.precio}</p>
                        <a href="#" class="btn btn-primary agregarCarrito" data-id="${celular.id}">Agregar al carrito</a>
                    </div>
                </div>`;
      sectionCards.innerHTML += html;
    });

    /* Agregar evento de clic a los botones "Agregar al carrito" de todas las tarjetas */
    agregarEventoAgregarAlCarrito();
  }
}
  


/* Función para mostrar el botón de limpiar búsqueda */
function mostrarBotonLimpiar() {
  limpiarBusqueda.style.display = "inline-block";
}

/* Función para ocultar el botón de limpiar búsqueda */
function ocultarBotonLimpiar() {
  limpiarBusqueda.style.display = "none";
}

/* Manejar el evento de click en el botón de búsqueda */
searchButton.addEventListener("click", function (e) {
  e.preventDefault();

  /* Obtener la barra de búsqueda y eliminar espacios en blanco al principio y al final, para evitar ingresos vacios por el usuario */
  const nombreBusqueda = searchInput.value.trim();

  /* Validar si la barra de búsqueda está vacía */
  if (nombreBusqueda === "") {
    // Mostrar un mensaje al usuario indicándole que debe ingresar un nombre
    searchInput.placeholder = "¡Ingrese un nombre!";
    // Detener la ejecución de la función
    return;
  }
  
  /* Limpiar el mensaje de advertencia si se había mostrado previamente */
  searchInput.placeholder = "";

  /* Filtrar los resultados por nombre de búsqueda */
  const resultadoBusqueda = filtrarPorNombre(nombreBusqueda);

  /* Mostrar los resultados de la búsqueda */
  pintarResultadoBusquedaYAgregarEvento(resultadoBusqueda);

  /* Mostrar el botón de limpiar búsqueda */
  mostrarBotonLimpiar();
});

/* Función para agregar evento de clic a los botones "Agregar al carrito" desde la búsqueda por nombre */
function agregarEventoAgregarAlCarrito() {
  const btnsAgregarCarrito = document.querySelectorAll(".agregarCarrito");
  
  /* Eliminar eventos de clic previamente agregados para evitar duplicados */
  btnsAgregarCarrito.forEach(btn => {
    btn.removeEventListener("click", agregarAlCarritoHandler);
  });

  /* Agregar eventos de clic actualizados */
  btnsAgregarCarrito.forEach(btn => {
    btn.addEventListener("click", agregarAlCarritoHandler);
  });

  /* Esta porcion de codigo se me hizo necesaria luego de modificar "pintarResultadoBusquedaYAgregarEvento(resultado)" para que en caso de que la busqueda de un celular fuera false, las cards no 
  dejen de pintarse en el DOM. Lo que ocasiono que luego de hacer una busqueda false o no, los elementos se agregaban por duplicado al array del carrito, debido a que se tenia que volver a llamar a la funcion que 
  pinta la cards y que llama al evento de los botones para que funcione. Entonces asi remuevo el evento de los botones que ya estan en LS o habilito el evento de los que no estaban.*/
}

/* Función de manejo de evento para agregar un celular al carrito */
function agregarAlCarritoHandler(e) {
  e.preventDefault();
  const celularID = this.getAttribute("data-id");
  const encontrado = buscarCelular(servDB, celularID);
  if (encontrado) {
    let carritoLS = JSON.parse(localStorage.getItem("carritoCompras")) || [];
    carritoLS.push(encontrado);
    localStorage.setItem("carritoCompras", JSON.stringify(carritoLS));
    actualizarContadorCarrito();
  } else {
    /* No se encontró el celular durante la búsqueda, mostrar mensaje de error */
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se encontró el celular con ID: ' + celularID
    });
  }
}

/* Funcion para VOLVER a pintar las cards originales en el DOM y poder seguir agrenando eventos al carrito */
function pintarTodasLasTarjetas() {
  crearHtml(servDB);
  agregarEventoAgregarAlCarrito(); // Si la quito no voy a poner agregar celulares al carrito al ejecutar el evento del botón.
}

/* Acceder al boton de limpiar busqueda */
const limpiarBusqueda = document.getElementById("cleanButton");

/* Ocultar el botón de limpiar búsqueda al cargar el DOM */
limpiarBusqueda.style.display = "none";

/* Manejador del evento de limpiar búsqueda */
limpiarBusqueda.addEventListener("click", (e) => {
  e.preventDefault();
  pintarTodasLasTarjetas();
  /* Ocultar el botón de limpiar búsqueda */
  ocultarBotonLimpiar();
  /* Reinicia el texto de la bara luego de una busqueda para evitar que quede vacia */
  searchInput.value = ""; // Limpiar el valor del campo de búsqueda
  searchInput.placeholder = "Buscar por nombre";
});

pintarTodasLasTarjetas();


/*********************************** FORMULARIO DE PRESTAMOS ***********************************/

/* Logica para el formulario de prestamos */
const form = document.querySelector('#interesForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombreInput = document.getElementById("nombre").value;
  const apellidoInput = document.getElementById("apellido").value;
  const emailInput = document.getElementById("email").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const interes = parseFloat(document.getElementById("interes").value);

  /* Verificacion de que recibe valores validos */
  if (isNaN(monto) || isNaN(interes)) {
      /* Mostrar mensaje de error con SweetAlert */
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, ingrese un monto e interés válidos.'
      });
      return;
  }

  const total = monto + (monto * (interes / 100));

  Swal.fire({
      icon: 'success',
      title: '¡Cálculo exitoso!',
      html: `Hola ${nombreInput} ${apellidoInput}, el total a pagar es: $${total.toFixed(2)}. En 24hs te enviaremos un email con los terminos y condiciones del préstamo. Gracias por elegirnos`
  }).then((result)=>{
    if (result.isConfirmed){
      form.reset()
    }
  });
});