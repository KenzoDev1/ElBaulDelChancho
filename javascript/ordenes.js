document.addEventListener('DOMContentLoaded', () => {
    const ordersAccordion = document.getElementById('orders-accordion');
    const noOrdersMessage = document.getElementById('no-orders-message');

    // Cargar las órdenes desde localStorage
    const ordenes = JSON.parse(localStorage.getItem('ordenes_vendedor')) || [];

    if (ordenes.length === 0) {
        // Si no hay órdenes, mostrar el mensaje
        noOrdersMessage.style.display = 'block';
    } else {
        // Si hay órdenes, renderizarlas
        noOrdersMessage.style.display = 'none';
        renderizarOrdenes(ordenes);
    }

    function renderizarOrdenes(ordenes) {
        ordersAccordion.innerHTML = ''; // Limpiar el contenedor

        // Es mejor mostrar las órdenes más nuevas primero
        ordenes.reverse().forEach((orden, index) => {
            const fecha = new Date(orden.fecha).toLocaleString('es-CL');
            const total = orden.total.toLocaleString('es-CL');

            // Crear el HTML para la tabla de productos de esta orden
            let itemsHtml = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            orden.items.forEach(item => {
                itemsHtml += `
                    <tr>
                        <td>${item.nombre}</td>
                        <td>${item.cantidad}</td>
                        <td>$${item.precio.toLocaleString('es-CL')}</td>
                        <td>$${(item.cantidad * item.precio).toLocaleString('es-CL')}</td>
                    </tr>
                `;
            });
            itemsHtml += '</tbody></table>';

            // Crear el elemento de acordeón para esta orden
            const accordionItem = document.createElement('div');
            accordionItem.classList.add('accordion-item');
            accordionItem.innerHTML = `
                <h2 class="accordion-header" id="heading-${orden.id}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${orden.id}" aria-expanded="false" aria-controls="collapse-${orden.id}">
                        <strong>Orden #${orden.id}</strong> - Fecha: ${fecha} - Total: $${total}
                    </button>
                </h2>
                <div id="collapse-${orden.id}" class="accordion-collapse collapse" aria-labelledby="heading-${orden.id}" data-bs-parent="#orders-accordion">
                    <div class="accordion-body">
                        <h5>Detalle de la Orden:</h5>
                        ${itemsHtml}
                    </div>
                </div>
            `;
            ordersAccordion.appendChild(accordionItem);
        });
    }
});