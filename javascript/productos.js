document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos desde localStorage, que es la fuente de datos actualizada por el admin.
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    const productList = document.getElementById('product-list');

    // Función para renderizar los productos en la página
    function renderizarProductos() {
        // Asegurarse de que el contenedor de productos exista antes de intentar modificarlo
        if (!productList) return;

        productList.innerHTML = ''; // Limpiar la lista antes de renderizar
        productos.forEach(producto => {
            const col = document.createElement('div');
            col.classList.add('col');
            // --- MODIFICACIÓN CLAVE ---
            // Se envuelve la imagen y el título en un enlace <a> que redirige al detalle.
            // Se le pasa el ID del producto por la URL. ej: ?id=1678886400000
            col.innerHTML = `
                <div class="card h-100 product-card shadow-sm">
                    <a href="detalle-producto.html?id=${producto.id}" class="text-decoration-none text-dark">
                        <img src="${producto.imagen || 'https://placehold.co/300x225'}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                        </div>
                    </a>
                    <div class="card-footer bg-white border-0 text-center pb-3">
                         <p class="card-text fw-bold fs-5 mb-2">$${producto.precio.toLocaleString('es-CL')}</p>
                         <button class="btn btn-primary w-100 btn-add-to-cart" data-id="${producto.id}">Añadir al carrito</button>
                    </div>
                </div>
            `;
            productList.appendChild(col);
        });
    }

    // Función para añadir un producto al carrito
    function anadirAlCarrito(e) {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const productoSeleccionado = productos.find(p => p.id === productId);

            // Obtenemos el carrito del localStorage o creamos uno nuevo si no existe
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            // Verificamos si el producto ya está en el carrito
            const productoEnCarrito = carrito.find(p => p.id === productId);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++; // Si ya está, solo aumenta la cantidad
            } else {
                // Si no está, lo añade con cantidad 1
                carrito.push({ ...productoSeleccionado, cantidad: 1 });
            }

            // Guardamos el carrito actualizado en localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));

            // Opcional: Mostrar una notificación de que el producto fue añadido
            alert(`"${productoSeleccionado.nombre}" ha sido añadido al carrito.`);
        }
    }

    // Renderizar productos al cargar la página
    renderizarProductos();

    // Añadir event listener al contenedor de productos para manejar los clics en los botones
    if (productList) {
        productList.addEventListener('click', anadirAlCarrito);
    }
});