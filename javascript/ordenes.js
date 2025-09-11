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

        // Mostrar las órdenes más nuevas primero
        ordenes.slice().reverse().forEach((orden) => {
            const fecha = new Date(orden.fecha).toLocaleString('es-CL');
            const total = orden.total.toLocaleString('es-CL');

            // Crear el HTML para la tabla de productos de esta orden
            let itemsHtml = `
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th class="text-center">Cantidad</th>
                            <th class="text-end">Precio Unit.</th>
                            <th class="text-end">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            orden.items.forEach(item => {
                itemsHtml += `
                    <tr>
                        <td>${item.nombre}</td>
                        <td class="text-center">${item.cantidad}</td>
                        <td class="text-end">$${item.precio.toLocaleString('es-CL')}</td>
                        <td class="text-end fw-bold">$${(item.cantidad * item.precio).toLocaleString('es-CL')}</td>
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
                        <div class="d-flex w-100 justify-content-between">
                            <span><strong>Orden #${orden.id}</strong></span>
                            <span>Cliente: ${orden.cliente}</span>
                            <span>Fecha: ${fecha}</span>
                            <span class="fw-bold">Total: $${total}</span>
                        </div>
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