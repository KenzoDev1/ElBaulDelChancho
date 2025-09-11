document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const btnComprar = document.getElementById('btn-comprar');
    const tablaCarrito = document.querySelector('.table');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function renderizarCarrito() {
        cartItemsContainer.innerHTML = '';

        if (carrito.length === 0) {
            cartEmptyMessage.style.display = 'block';
            tablaCarrito.style.display = 'none';
            btnComprar.disabled = true;
        } else {
            cartEmptyMessage.style.display = 'none';
            tablaCarrito.style.display = 'table';
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

    function actualizarTotal() {
        const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }

    function manejarEventosCarrito(e) {
        const target = e.target;
        if (!target.dataset.id) return;

        const productId = parseInt(target.dataset.id);

        if (target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
                carrito = carrito.filter(p => p.id !== productId);
                guardarYRenderizar();
            }
        }
        
        if (target.matches('input[type="number"]')) {
            const nuevaCantidad = parseInt(target.value);
            const productoEnCarrito = carrito.find(p => p.id === productId);

            if (productoEnCarrito && nuevaCantidad > 0) {
                productoEnCarrito.cantidad = nuevaCantidad;
                guardarYRenderizar();
            }
        }
    }
    
    function guardarYRenderizar() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

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

        // --- INICIO DE LA MODIFICACIÓN ---
        // 1. Obtener la lista completa de productos
        let todosLosProductos = JSON.parse(localStorage.getItem('productos')) || [];

        // 2. Actualizar el stock de cada producto comprado
        carrito.forEach(itemCarrito => {
            const productoIndex = todosLosProductos.findIndex(p => p.id === itemCarrito.id);
            if (productoIndex !== -1) {
                todosLosProductos[productoIndex].stock -= itemCarrito.cantidad;
            }
        });

        // 3. Guardar la lista de productos actualizada en localStorage
        localStorage.setItem('productos', JSON.stringify(todosLosProductos));
        // --- FIN DE LA MODIFICACIÓN ---

        const detalleCompra = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            cliente: currentUser.email,
            items: carrito,
            total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
        };

        let ordenes = JSON.parse(localStorage.getItem('ordenes_vendedor')) || [];
        ordenes.push(detalleCompra);
        localStorage.setItem('ordenes_vendedor', JSON.stringify(ordenes));

        carrito = [];
        localStorage.removeItem('carrito');

        alert("¡Gracias por tu compra! Tu pedido ha sido registrado con éxito.");
        window.location.href = 'inicio.html';
    }

    cartItemsContainer.addEventListener('click', manejarEventosCarrito);
    cartItemsContainer.addEventListener('change', manejarEventosCarrito);
    btnComprar.addEventListener('click', finalizarCompra);

    renderizarCarrito();
});