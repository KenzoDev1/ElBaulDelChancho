document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const btnComprar = document.getElementById('btn-comprar');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function renderizarCarrito() {
        cartItemsContainer.innerHTML = ''; // Limpiar el carrito antes de renderizar
        if (carrito.length === 0) {
            cartEmptyMessage.style.display = 'block';
            btnComprar.disabled = true;
        } else {
            cartEmptyMessage.style.display = 'none';
            btnComprar.disabled = false;
            carrito.forEach(producto => {
                const subtotal = producto.precio * producto.cantidad;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio.toLocaleString('es-CL')}</td>
                    <td>
                        <input type="number" value="${producto.cantidad}" min="1" class="form-control form-control-sm w-50" data-id="${producto.id}">
                    </td>
                    <td>$${subtotal.toLocaleString('es-CL')}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" data-id="${producto.id}">Eliminar</button>
                    </td>
                `;
                cartItemsContainer.appendChild(tr);
            });
        }
        actualizarTotal();
    }

    function actualizarTotal() {
        const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }

    function manejarEventosCarrito(e) {
        // Eliminar producto
        if (e.target.classList.contains('btn-danger')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            carrito = carrito.filter(p => p.id !== productId);
        }
        // Actualizar cantidad
        if (e.target.matches('input[type="number"]')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const nuevaCantidad = parseInt(e.target.value);
            const productoEnCarrito = carrito.find(p => p.id === productId);
            if (productoEnCarrito && nuevaCantidad > 0) {
                productoEnCarrito.cantidad = nuevaCantidad;
            }
        }
        // Guardar y re-renderizar
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

    function finalizarCompra() {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        // Crear el detalle de la compra
        const detalleCompra = {
            id: Date.now(), // ID único para la compra
            fecha: new Date().toISOString(),
            items: carrito,
            total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
        };

        // Simulación: Guardar la compra en localStorage para que el "vendedor" la vea.
        // En una app real, esto se enviaría a un servidor.
        let ordenes = JSON.parse(localStorage.getItem('ordenes_vendedor')) || [];
        ordenes.push(detalleCompra);
        localStorage.setItem('ordenes_vendedor', JSON.stringify(ordenes));

        // Limpiar el carrito del cliente
        localStorage.removeItem('carrito');
        carrito = [];

        // Notificar al usuario y redirigir
        alert("¡Gracias por tu compra! Tu pedido ha sido registrado.");
        window.location.href = 'productos.html'; // Redirigir a la página de productos
    }

    // Event Listeners
    cartItemsContainer.addEventListener('click', manejarEventosCarrito);
    cartItemsContainer.addEventListener('change', manejarEventosCarrito);
    btnComprar.addEventListener('click', finalizarCompra);

    // Renderizar el carrito al cargar la página
    renderizarCarrito();
});