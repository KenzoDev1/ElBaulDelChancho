document.addEventListener('DOMContentLoaded', () => {
    const productsTable = document.getElementById('products-table');
    const productsTableBody = document.getElementById('products-table-body');
    const noProductsMessage = document.getElementById('no-products-message');

    // Cargar los productos desde localStorage
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    if (productos.length === 0) {
        // Si no hay productos, mostrar el mensaje y ocultar la tabla
        noProductsMessage.style.display = 'block';
        productsTable.style.display = 'none';
    } else {
        // Si hay productos, ocultar el mensaje y mostrar la tabla
        noProductsMessage.style.display = 'none';
        productsTable.style.display = 'table';
        renderizarProductos(productos);
    }

    function renderizarProductos(productos) {
        productsTableBody.innerHTML = ''; // Limpiar el contenido previo

        productos.forEach(producto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.nombre}</td>
                <td class="text-center">${producto.stock}</td>
                <td class="text-end">$${producto.precio.toLocaleString('es-CL')}</td>
                <td>${producto.categoria}</td>
            `;
            productsTableBody.appendChild(tr);
        });
    }
});