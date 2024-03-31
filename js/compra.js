/* Obtener el array de objetos del carrito desde LS */

const carritoItemsJSON = localStorage.getItem('carritoCompras');
console.log(carritoItemsJSON);
/* Convertir la cadena JSON de vuelta a un array de objetos */
const carritoItems = JSON.parse(carritoItemsJSON);

/* Función para pintar los elementos del carrito en la página */
const carritoContainer = document.getElementById('carritoContainer');
console.log(carritoContainer);
function pintarCarritoCompra() {

    /* Limpiar el contenido anterior del contenedor */
    carritoContainer.innerHTML = "";

     /* Verificar si hay elementos en el carrito */
    if (carritoItems && carritoItems.length > 0) {

        let precioTotal = 0;
        /* Generar el HTML para cada elemento del carrito */
        carritoItems.forEach(item => {
            const itemHTML = `
                <div class="containerCompra">
                    <img class="containerCompraImg" src="../img/${item.img}" alt="${item.celular}">
                    <p>${item.celular}</p>
                    <p> $${item.precio}</p>
                    
                    
                </div>
            `;
            carritoContainer.innerHTML += itemHTML;

            precioTotal += item.precio
        });
        /* Mostrar el precio total del carrito */
         const totalCarritoCompra = document.createElement("div");
         totalCarritoCompra.classList.add("total-carrito");
         totalCarritoCompra.innerHTML = `<p>Total: $${precioTotal}</p>`;
         carritoContainer.appendChild(totalCarritoCompra);
    } else {
         /* Mostrar un mensaje si el carrito está vacío */
        carritoContainer.innerHTML = "<p>El carrito está vacío</p>";
    }
}

 /* Llamar a la función para pintar los elementos del carrito */
pintarCarritoCompra();


/* Función para validar el formulario de compra */
function validarFormulario() {
    /* Obtener los valores de los campos del formulario */
    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const nombreTitular = document.getElementById('nombreTitular').value;
    const cvc = document.getElementById('cvc').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;

    /* Expresiones regulares para las validaciones */
    const regexNumeroTarjeta = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    const regexNombreTitular = /^[a-zA-Z\s]+$/;
    const regexCVC = /^\d{3}$/;
    const regexFechaVencimiento = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;

    /* Validar cada campo del formulario */
    if (!regexNumeroTarjeta.test(numeroTarjeta)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, ingrese un número de tarjeta válido (formato: XXXX-XXXX-XXXX-XXXX)'
        });
        return false;
    }
    if (!regexNombreTitular.test(nombreTitular)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, ingrese un nombre de titular válido (Nombre y Apellido, solo letras)'
        });
        return false;
    }
    if (!regexCVC.test(cvc)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, ingrese un CVC válido (3 números)'
        });
        return false;
    }
    if (!regexFechaVencimiento.test(fechaVencimiento)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, ingrese una fecha de vencimiento válida (formato: MM/AA)'
        });
        return false;
    }

    /* Si todos los campos son válidos, retornar true */
    return true;
}

/* Obtener el formulario de compra */
const formularioCompra = document.getElementById('formularioCompra');

/* Agregar un evento de escucha para cuando se envíe el formulario */
formularioCompra.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    /* Validar el formulario antes de enviarlo */
    if (validarFormulario()) {
        // Obtener la cantidad de cuotas seleccionada por el usuario
        const cuotas = parseInt(document.getElementById('cuotas').value);

        let precioTotal = 0;

        carritoItems.forEach(item => {
            precioTotal += item.precio;
        });

        /* Calcular el precio por cuota */
        const precioPorCuota = precioTotal / cuotas;

        /* Mostrar la información de pago por cuotas */
        Swal.fire({
            icon: 'success',
            title: '¡Gracias por su compra!',
            text: `Usted pagará ${cuotas} cuota/s de $${precioPorCuota.toFixed(2)}. Al presionar OK volverá al inicio.`,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../index.html';
            }
        });


        /* Limpiar el carrito de compras en localStorage */
        localStorage.removeItem('carritoCompras');
    }
});



