document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const btnComprar = document.getElementById('btn-comprar');
    const tablaCarrito = document.querySelector('.table'); // Seleccionamos la tabla

    // Cargar carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función principal para dibujar el carrito en pantalla
    function renderizarCarrito() {
        cartItemsContainer.innerHTML = ''; // Limpiar el contenido previo

        if (carrito.length === 0) {
            // Si no hay productos, mostrar mensaje y ocultar la tabla
            cartEmptyMessage.style.display = 'block';
            tablaCarrito.style.display = 'none'; // Ocultar tabla
            btnComprar.disabled = true;
        } else {
            // Si hay productos, ocultar mensaje y mostrar la tabla
            cartEmptyMessage.style.display = 'none';
            tablaCarrito.style.display = 'table'; // Mostrar tabla
            btnComprar.disabled = false;
            
            carrito.forEach(producto => {
                const subtotal = producto.precio * producto.cantidad;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${producto.imagen || 'https://placehold.co/100x75'}" alt="${producto.nombre}" class="img-fluid rounded me-3" style="width: 100px;">
                            ${producto.nombre}
                        </div>
                    </td>
                    <td>$${producto.precio.toLocaleString('es-CL')}</td>
                    <td>
                        <input type="number" value="${producto.cantidad}" min="1" max="${producto.stock}" class="form-control form-control-sm" style="width: 70px;" data-id="${producto.id}">
                    </td>
                    <td class="fw-bold">$${subtotal.toLocaleString('es-CL')}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.id}">Eliminar</button>
                    </td>
                `;
                cartItemsContainer.appendChild(tr);
            });
        }
        actualizarTotal();
    }

    // Función para calcular y mostrar el total de la compra
    function actualizarTotal() {
        const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }

    // Función para manejar los eventos de clic (eliminar) y cambio (cantidad)
    function manejarEventosCarrito(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        if (!productId) return;

        // Si se hace clic en el botón de eliminar
        if (e.target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
                carrito = carrito.filter(p => p.id !== productId);
                guardarYRenderizar();
            }
        }
        
        // Si se cambia el valor del input de cantidad
        if (e.target.matches('input[type="number"]')) {
            const nuevaCantidad = parseInt(e.target.value);
            const productoEnCarrito = carrito.find(p => p.id === productId);

            if (productoEnCarrito && nuevaCantidad > 0) {
                productoEnCarrito.cantidad = nuevaCantidad;
                guardarYRenderizar();
            }
        }
    }
    
    // Función auxiliar para guardar en localStorage y volver a renderizar
    function guardarYRenderizar() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

    // Función para simular la finalización de la compra
    function finalizarCompra() {
        if (carrito.length === 0) {
            alert("El carrito está vacío. Añade productos antes de comprar.");
            return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            alert("Debes iniciar sesión para poder comprar.");
            window.location.href = '../login.html';
            return;
        }

        const detalleCompra = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            cliente: currentUser.email, // Guardamos quién hizo la compra
            items: carrito,
            total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
        };

        let ordenes = JSON.parse(localStorage.getItem('ordenes_vendedor')) || [];
        ordenes.push(detalleCompra);
        localStorage.setItem('ordenes_vendedor', JSON.stringify(ordenes));

        // Limpiar el carrito del cliente
        carrito = [];
        localStorage.removeItem('carrito');

        alert("¡Gracias por tu compra! Tu pedido ha sido registrado con éxito.");
        window.location.href = 'inicio.html'; // Redirigir a la página de inicio
    }

    // --- Asignación de Eventos ---
    cartItemsContainer.addEventListener('click', manejarEventosCarrito);
    cartItemsContainer.addEventListener('change', manejarEventosCarrito);
    btnComprar.addEventListener('click', finalizarCompra);

    // Renderizar el carrito al cargar la página por primera vez
    renderizarCarrito();
});