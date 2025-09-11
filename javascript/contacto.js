document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function (event) {
        // Prevenir el envío automático para poder validar primero
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;
        
        // --- Validación del Nombre ---
        const nombreInput = document.getElementById('nombre');
        // Requerido y máximo 100 caracteres
        if (nombreInput.value.trim() === '' || nombreInput.value.length > 100) {
            nombreInput.classList.add('is-invalid');
            isValid = false;
        } else {
            nombreInput.classList.remove('is-invalid');
            nombreInput.classList.add('is-valid');
        }

        // --- Validación del Correo ---
        const correoInput = document.getElementById('correo');
        const emailValue = correoInput.value;
        const validDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        // Requerido, máximo 100 caracteres y debe terminar con un dominio válido
        if (emailValue.length > 100 || !validDomains.some(domain => emailValue.endsWith(domain))) {
            correoInput.classList.add('is-invalid');
            isValid = false;
        } else {
            correoInput.classList.remove('is-invalid');
            correoInput.classList.add('is-valid');
        }

        // --- Validación del Comentario ---
        const comentarioInput = document.getElementById('comentario');
        // Requerido y máximo 500 caracteres
        if (comentarioInput.value.trim() === '' || comentarioInput.value.length > 500) {
            comentarioInput.classList.add('is-invalid');
            isValid = false;
        } else {
            comentarioInput.classList.remove('is-invalid');
            comentarioInput.classList.add('is-valid');
        }


        // Si todo es válido, se envía el formulario
        if (isValid) {
            alert('¡Mensaje enviado con éxito! Gracias por contactarnos.');
            contactForm.reset(); // Limpia el formulario
            // Quita las clases de validación para el siguiente uso
            document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
        }
    });
});