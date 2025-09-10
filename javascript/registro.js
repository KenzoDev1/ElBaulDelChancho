// registro.js

//Asegurando de que se cargó la página
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registroForm');
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const emailInput = document.getElementById('email');

    // Cargar regiones al iniciar
    if (typeof regionesYComunas !== 'undefined' && regionSelect) {
        regionesYComunas.regiones.forEach(region => {
            const option = document.createElement('option');
            option.value = region.nombre;
            option.textContent = region.nombre;
            regionSelect.appendChild(option);
        });
    }

    // Evento para cargar comunas cuando se cambia la región
    if (regionSelect && comunaSelect) {
        regionSelect.addEventListener('change', function () {
            const selectedRegion = this.value;
            comunaSelect.innerHTML = '<option selected disabled value="">Seleccione una comuna...</option>';
            
            if (selectedRegion) {
                const regionData = regionesYComunas.regiones.find(r => r.nombre === selectedRegion);
                if (regionData) {
                    regionData.comunas.forEach(comuna => {
                        const option = document.createElement('option');
                        option.value = comuna;
                        option.textContent = comuna;
                        comunaSelect.appendChild(option);
                    });
                    comunaSelect.disabled = false;
                }
            } else {
                comunaSelect.disabled = true;
            }
        });
    }

    // Validación y envío del formulario de registro
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // 1. Validación de dominio de correo
            const emailValue = emailInput.value;
            const validDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            const isEmailValid = validDomains.some(domain => emailValue.endsWith(domain));

            if (!isEmailValid) {
                alert('Por favor, use un correo con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.');
                return; // Detiene el proceso
            }

            // 2. Validación de contraseñas coincidentes
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return; // Detiene el proceso
            }

            // 3. Si las validaciones JS pasan, se procede a guardar
            if (form.checkValidity()) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const formData = new FormData(form);
                const newUser = Object.fromEntries(formData.entries());
                
                // 4. Verificar si el RUN o el email ya existen
                if (users.some(user => user.run === newUser.run || user.email === newUser.email)) {
                    alert('El RUN o el correo electrónico ya están registrados.');
                    return;
                }

                // 5. Asignar rol por defecto y guardar
                newUser.tipoUsuario = 'cliente'; // Todos los nuevos registros son clientes
                delete newUser.confirmPassword; // No guardar la confirmación de contraseña
                
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                alert('¡Registro exitoso!');
                form.reset();
                comunaSelect.disabled = true;
            } else {
                // Si hay errores de validación HTML5, se puede mostrar un mensaje general
                alert('Por favor, complete todos los campos requeridos correctamente.');
            }
        });
    }
});