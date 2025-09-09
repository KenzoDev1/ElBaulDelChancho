// registro.js

//Asegurando de que se cargó la página
document.addEventListener('DOMContentLoaded', function () {
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    const form = document.getElementById('registroForm');
    const emailInput = document.getElementById('email');

    // Cargar regiones
    if (regionesYComunas && regionSelect) {
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
            comunaSelect.innerHTML = '<option selected disabled value="">Seleccione una comuna...</option>'; // Limpiar comunas
            
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

    // Validación del formulario
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevenir el envío por defecto

            // Validación de correo
            const emailValue = emailInput.value;
            const validDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            const isEmailValid = validDomains.some(domain => emailValue.endsWith(domain));

            if (!isEmailValid) {
                emailInput.classList.add('is-invalid');
            } else {
                emailInput.classList.remove('is-invalid');
            }

            // Validación de contraseñas
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                // Aquí podrías agregar una clase 'is-invalid' a los campos de contraseña
                return; // Detener el proceso si no coinciden
            }

            // Si todas las validaciones de HTML y JS son correctas
            if (form.checkValidity() && isEmailValid) {
                console.log('Formulario válido. Enviando datos...');
                // Aquí iría la lógica para enviar los datos al servidor
                alert('¡Registro exitoso!');
                form.reset(); // Limpiar el formulario
                comunaSelect.disabled = true; // Resetear el select de comuna
                emailInput.classList.remove('is-invalid');
            } else {
                // Bootstrap se encarga de mostrar los errores de validación de HTML5
                // pero forzamos la validación para que se muestren si el usuario no ha interactuado
                form.classList.add('was-validated');
                if (!isEmailValid) {
                    emailInput.classList.add('is-invalid');
                }
            }
        });
    }
});