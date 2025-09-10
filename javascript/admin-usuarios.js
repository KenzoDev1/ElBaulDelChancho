document.addEventListener('DOMContentLoaded', function () {
    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const btnCrearUsuario = document.getElementById('btn-crear-usuario');
    const modal = document.getElementById('usuario-modal');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');
    const usuarioForm = document.getElementById('usuarioForm');
    const modalTitulo = document.getElementById('usuario-modal-titulo');
    const tablaUsuariosBody = document.getElementById('tablaUsuarios');
    
    // Campos del formulario para validaciones específicas
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const emailInput = document.getElementById('email');
    
    let editando = false;
    let runUsuarioEditado = null;

    // --- FUNCIONES PARA MANEJAR LOCALSTORAGE ---
    function getUsuarios() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    function saveUsuarios(usuarios) {
        localStorage.setItem('users', JSON.stringify(usuarios));
    }

    // --- FUNCIONES DE LA INTERFAZ ---
    function renderizarUsuarios() {
        const usuarios = getUsuarios();
        tablaUsuariosBody.innerHTML = '';
        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.run}</td>
                <td>${usuario.nombre} ${usuario.apellidos}</td>
                <td>${usuario.email}</td>
                <td>${usuario.tipoUsuario ? usuario.tipoUsuario.charAt(0).toUpperCase() + usuario.tipoUsuario.slice(1) : 'No definido'}</td>
                <td>
                    <button class="btn-editar" data-run="${usuario.run}">Editar</button>
                    <button class="btn-eliminar" data-run="${usuario.run}">Eliminar</button>
                </td>
            `;
            tablaUsuariosBody.appendChild(tr);
        });
    }

    function abrirModal() {
        modal.style.display = 'block';
    }

    function cerrarModal() {
        modal.style.display = 'none';
        usuarioForm.reset();
        comunaSelect.disabled = true;
        comunaSelect.innerHTML = '<option selected disabled value="">Seleccione una comuna...</option>';
        editando = false;
        runUsuarioEditado = null;
    }

    function cargarRegiones() {
        if (typeof regionesYComunas !== 'undefined' && regionSelect) {
            regionSelect.innerHTML = '<option selected disabled value="">Seleccione una región...</option>';
            regionesYComunas.regiones.forEach(region => {
                const option = document.createElement('option');
                option.value = region.nombre;
                option.textContent = region.nombre;
                regionSelect.appendChild(option);
            });
        }
    }

    function cargarComunas(nombreRegion) {
        const regionData = regionesYComunas.regiones.find(r => r.nombre === nombreRegion);
        comunaSelect.innerHTML = '<option selected disabled value="">Seleccione una comuna...</option>';
        if (regionData) {
            regionData.comunas.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
            comunaSelect.disabled = false;
        } else {
            comunaSelect.disabled = true;
        }
    }

    // --- LÓGICA DE EVENTOS ---
    btnCrearUsuario.addEventListener('click', () => {
        modalTitulo.textContent = 'Crear Nuevo Usuario';
        editando = false;
        usuarioForm.reset();
        document.getElementById('run').disabled = false;
        abrirModal();
    });

    btnCerrarModal.addEventListener('click', cerrarModal);
    btnCancelarModal.addEventListener('click', cerrarModal);

    regionSelect.addEventListener('change', () => {
        cargarComunas(regionSelect.value);
    });

    tablaUsuariosBody.addEventListener('click', (e) => {
        const run = e.target.dataset.run;
        let usuarios = getUsuarios();

        if (e.target.classList.contains('btn-editar')) {
            const usuarioAEditar = usuarios.find(u => u.run === run);
            if (usuarioAEditar) {
                modalTitulo.textContent = 'Editar Usuario';
                editando = true;
                runUsuarioEditado = run;
                document.getElementById('run').value = usuarioAEditar.run;
                document.getElementById('run').disabled = true;
                document.getElementById('nombre').value = usuarioAEditar.nombre;
                document.getElementById('apellidos').value = usuarioAEditar.apellidos;
                document.getElementById('email').value = usuarioAEditar.email;
                document.getElementById('fechaNacimiento').value = usuarioAEditar.fechaNacimiento;
                document.getElementById('tipoUsuario').value = usuarioAEditar.tipoUsuario;
                document.getElementById('region').value = usuarioAEditar.region;
                cargarComunas(usuarioAEditar.region);
                document.getElementById('comuna').value = usuarioAEditar.comuna;
                document.getElementById('direccion').value = usuarioAEditar.direccion;
                document.getElementById('password').value = '';
                abrirModal();
            }
        }

        if (e.target.classList.contains('btn-eliminar')) {
            if (confirm(`¿Estás seguro de que quieres eliminar al usuario con RUN ${run}?`)) {
                let usuariosActualizados = usuarios.filter(u => u.run !== run);
                saveUsuarios(usuariosActualizados);
                renderizarUsuarios();
            }
        }
    });

    usuarioForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // --- VALIDACIÓN DE CORREO ELECTRÓNICO ---
        const emailValue = emailInput.value;
        const validDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const isEmailValid = validDomains.some(domain => emailValue.endsWith(domain));
        if (!isEmailValid) {
            alert('El dominio del correo no es válido. Use @duoc.cl, @profesor.duoc.cl o @gmail.com.');
            return;
        }

        let usuarios = getUsuarios();
        const formData = new FormData(usuarioForm);
        const datosUsuario = Object.fromEntries(formData.entries());

        if (editando) {
            const index = usuarios.findIndex(u => u.run === runUsuarioEditado);
            if (index !== -1) {
                const usuarioOriginal = usuarios[index];
                usuarios[index] = {
                    ...usuarioOriginal,
                    ...datosUsuario,
                    run: runUsuarioEditado,
                    password: datosUsuario.password ? datosUsuario.password : usuarioOriginal.password
                };
            }
        } else {
            datosUsuario.run = document.getElementById('run').value;
            if (usuarios.some(u => u.run === datosUsuario.run)) {
                alert('El RUN ingresado ya existe.');
                return;
            }
            if (!datosUsuario.password) {
                alert('La contraseña es obligatoria para nuevos usuarios.');
                return;
            }
            usuarios.push(datosUsuario);
        }

        saveUsuarios(usuarios);
        renderizarUsuarios();
        cerrarModal();
    });

    // --- INICIALIZACIÓN ---
    cargarRegiones();
    renderizarUsuarios();
});