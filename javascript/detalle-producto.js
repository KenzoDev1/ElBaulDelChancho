document.addEventListener('DOMContentLoaded', () => {
    const productoDetalleContainer = document.getElementById('producto-detalle-container');

    // 1. Obtener el ID del producto de la URL (ej: ?id=123)
    const params = new URLSearchParams(window.location.search);
    const productoId = parseInt(params.get('id'));

    // Si no hay ID en la URL, no se puede continuar
    if (!productoId) {
        productoDetalleContainer.innerHTML = '<div class="alert alert-danger">Error: No se ha especificado un producto.</div>';
        return;
    }

    // 2. Cargar todos los productos desde localStorage
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    // 3. Encontrar el producto que coincida con el ID de la URL
    const producto = productos.find(p => p.id === productoId);

    // 4. Mostrar la información del producto o un mensaje de error
    if (producto && productoDetalleContainer) {
        // Si se encontró el producto, se crea el HTML para mostrarlo
        productoDetalleContainer.innerHTML = `
            <div class="col-lg-6 mb-4">
                <img src="${producto.imagen || 'https://placehold.co/600x400'}" class="img-fluid rounded shadow-sm" alt="${producto.nombre}">
            </div>
            <div class="col-lg-6">
                <h1 class="display-5">${producto.nombre}</h1>
                <p class="fs-3 fw-bold text-primary mb-3">$${producto.precio.toLocaleString('es-CL')}</p>
                <p class="lead">${producto.descripcion || 'No hay descripción disponible para este producto.'}</p>
                <hr>
                <p><strong>Categoría:</strong> ${producto.categoria}</p>
                <p><strong>Stock disponible:</strong> ${producto.stock}</p>
                <div class="d-grid gap-2 mt-4">
                    <button class="btn btn-primary btn-lg" id="btn-anadir-carrito-detalle" data-id="${producto.id}">
                        <i class="bi bi-cart-plus-fill"></i> Añadir al carrito
                    </button>
                </div>
            </div>
        `;

        // 5. Se le da funcionalidad al botón "Añadir al carrito"
        const btnAnadirCarrito = document.getElementById('btn-anadir-carrito-detalle');
        btnAnadirCarrito.addEventListener('click', () => {
            anadirAlCarritoDesdeDetalle(producto);
        });

    } else {
        // Si no se encontró un producto con ese ID, se muestra un error
        productoDetalleContainer.innerHTML = '<div class="alert alert-danger text-center"><h3>Producto no encontrado</h3><p>El producto que buscas no existe o fue eliminado.</p><a href="productos.html" class="btn btn-primary">Volver a productos</a></div>';
    }
});

// Función específica para añadir al carrito desde la página de detalle
function anadirAlCarritoDesdeDetalle(productoSeleccionado) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoId = productoSeleccionado.id;

    // Verificamos si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(p => p.id === productoId);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...productoSeleccionado, cantidad: 1 });
    }

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Notificar al usuario
    alert(`"${productoSeleccionado.nombre}" ha sido añadido al carrito.`);
}