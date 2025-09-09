document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores de elementos del DOM ---
    const formProducto = document.getElementById('form-producto');
    const tablaBody = document.getElementById('tabla-productos-body');
    const erroresDiv = document.getElementById('errores-form');
    const formTitulo = document.getElementById('form-titulo');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnCancelar = document.getElementById('btn-cancelar');

    // --- Funciones para manejar el localStorage ---
    const obtenerProductos = () => JSON.parse(localStorage.getItem('productos')) || [];
    const guardarProductos = (productos) => localStorage.setItem('productos', JSON.stringify(productos));

    // --- Función para mostrar los productos en la tabla ---
    const renderizarProductos = () => {
        const productos = obtenerProductos();
        tablaBody.innerHTML = '';
        productos.forEach((producto) => {
            const tr = document.createElement('tr');
            if (producto.stock_critico !== null && producto.stock <= producto.stock_critico) {
                tr.classList.add('stock-critico');
            }
            tr.innerHTML = `
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>$${parseFloat(producto.precio).toLocaleString('es-CL')}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn-editar" data-id="${producto.id}">Editar</button>
                    <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(tr);
        });
    };

    // --- Función para cambiar a modo edición ---
    const entrarModoEdicion = (producto) => {
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('producto-codigo').value = producto.codigo;
        document.getElementById('producto-nombre').value = producto.nombre;
        document.getElementById('producto-precio').value = producto.precio;
        document.getElementById('producto-stock').value = producto.stock;
        document.getElementById('producto-categoria').value = producto.categoria;
        document.getElementById('producto-descripcion').value = producto.descripcion;
        document.getElementById('producto-imagen').value = producto.imagen;
        document.getElementById('producto-stock-critico').value = producto.stock_critico ?? '';

        formTitulo.textContent = 'Editando Producto';
        btnGuardar.textContent = 'Actualizar Producto';
        btnCancelar.style.display = 'inline-block';
    };

    // --- Función para limpiar el formulario y salir del modo edición ---
    const salirModoEdicion = () => {
        formProducto.reset();
        document.getElementById('producto-id').value = '';
        formTitulo.textContent = 'Añadir Nuevo Producto';
        btnGuardar.textContent = 'Guardar Producto';
        btnCancelar.style.display = 'none';
        erroresDiv.innerHTML = '';
    };

    // --- Función de validación ---
    const validarFormulario = () => {
        const codigo = document.getElementById('producto-codigo').value.trim();
        const nombre = document.getElementById('producto-nombre').value.trim();
        const precio = document.getElementById('producto-precio').value;
        const stock = document.getElementById('producto-stock').value;
        const categoria = document.getElementById('producto-categoria').value;
        const descripcion = document.getElementById('producto-descripcion').value.trim();
        const stockCritico = document.getElementById('producto-stock-critico').value;

        let errores = [];
        erroresDiv.innerHTML = '';

        // Validaciones
        if (!codigo) errores.push('El código es requerido.');
        if (codigo.length < 3) errores.push('El código debe tener al menos 3 caracteres.');
        if (!nombre) errores.push('El nombre es requerido.');
        if (nombre.length > 100) errores.push('El nombre no puede exceder los 100 caracteres.');
        if (descripcion.length > 500) errores.push('La descripción no puede exceder los 500 caracteres.');
        if (precio === '' || parseFloat(precio) < 0) errores.push('El precio es requerido y debe ser 0 o mayor.');
        if (stock === '' || parseInt(stock) < 0 || !Number.isInteger(Number(stock))) errores.push('El stock es requerido, debe ser un número entero y 0 o mayor.');
        if (!categoria) errores.push('La categoría es requerida.');
        if (stockCritico !== '' && (parseInt(stockCritico) < 0 || !Number.isInteger(Number(stockCritico)))) errores.push('El stock crítico debe ser un número entero y 0 o mayor.');

        if (errores.length > 0) {
            erroresDiv.innerHTML = errores.join('<br>');
            return false;
        }
        return true;
    };

    // --- Evento para guardar (Añadir o Editar) ---
    formProducto.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validarFormulario()) return; // Detiene si la validación falla

        const productoId = document.getElementById('producto-id').value;
        let productos = obtenerProductos();
        const stockCriticoValue = document.getElementById('producto-stock-critico').value;

        const datosProducto = {
            codigo: document.getElementById('producto-codigo').value.trim(),
            nombre: document.getElementById('producto-nombre').value.trim(),
            precio: parseFloat(document.getElementById('producto-precio').value),
            stock: parseInt(document.getElementById('producto-stock').value),
            categoria: document.getElementById('producto-categoria').value,
            descripcion: document.getElementById('producto-descripcion').value.trim(),
            imagen: document.getElementById('producto-imagen').value.trim(),
            stock_critico: stockCriticoValue === '' ? null : parseInt(stockCriticoValue),
        };

        if (productoId) { // Modo Edición
            const indice = productos.findIndex(p => p.id == productoId);
            if (indice !== -1) {
                productos[indice] = { id: productos[indice].id, ...datosProducto };
            }
        } else { // Modo Añadir
            datosProducto.id = Date.now();
            productos.push(datosProducto);
        }

        guardarProductos(productos);
        renderizarProductos();
        salirModoEdicion();
    });

    // ==================================================================
    // ESTA ES LA PARTE CLAVE PARA QUE FUNCIONEN LOS BOTONES EDITAR Y ELIMINAR
    // ==================================================================
    tablaBody.addEventListener('click', (event) => {
        const target = event.target;
        const productoId = target.getAttribute('data-id');

        // Si no se hizo clic en un botón con data-id, no hacer nada
        if (!productoId) return;

        // Si el botón tiene la clase 'btn-editar'
        if (target.classList.contains('btn-editar')) {
            const productos = obtenerProductos();
            const productoAEditar = productos.find(p => p.id == productoId);
            if (productoAEditar) {
                entrarModoEdicion(productoAEditar);
            }
        }

        // Si el botón tiene la clase 'btn-eliminar'
        if (target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                let productos = obtenerProductos();
                productos = productos.filter(p => p.id != productoId);
                guardarProductos(productos);
                renderizarProductos();
            }
        }
    });
    // ==================================================================

    // --- Evento para el botón de cancelar edición ---
    btnCancelar.addEventListener('click', () => {
        salirModoEdicion();
    });

    // --- Carga inicial de los productos en la tabla ---
    renderizarProductos();
});